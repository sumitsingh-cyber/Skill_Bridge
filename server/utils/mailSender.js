const nodemailer = require("nodemailer");
const { Resend } = require("resend");
require("dotenv").config();

const htmlToText = (html = "") =>
  html.replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isGmailHost = (host = "") => host.toLowerCase().includes("gmail");
const isBrevoLogin = (user = "") => user.toLowerCase().includes("smtp-brevo.com");
const isBadSenderAddress = (email = "") =>
  !email || email.toLowerCase().includes("smtp-brevo.com");

const normalizePassword = (host, password) => {
  if (!password) {
    return password;
  }

  return isGmailHost(host) ? password.replace(/\s+/g, "") : password;
};

const getMailInput = (emailOrOptions, title, body) => {
  if (typeof emailOrOptions === "object" && emailOrOptions !== null) {
    return {
      to: emailOrOptions.to,
      subject: emailOrOptions.subject,
      html: emailOrOptions.html,
      text: emailOrOptions.text,
    };
  }

  return {
    to: emailOrOptions,
    subject: title,
    html: body,
  };
};

const sendWithResend = async ({ to, subject, html, text, from, apiKey }) => {
  const resend = new Resend(apiKey || process.env.RESEND_API_KEY || "re_fL4mQ468_6T3tSFQv9jFLSVydTdLtBx1k");

  const { data, error } = await resend.emails.send({
    from: `SkillBridge <${from}>`,
    to,
    subject,
    html,
    text: text || htmlToText(html),
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send email");
  }

  console.log("============== EMAIL DEBUG ==============");
  console.log("Provider: Resend");
  console.log("To:", to);
  console.log("Message ID:", data?.id);
  console.log("=========================================");

  return {
    provider: "resend",
    messageId: data?.id,
    accepted: [to],
    rejected: [],
    response: "Queued by Resend",
  };
};

const createSmtpTransporter = () => {
  const host = "smtp.gmail.com";
  const port = 465;
  const user = "ankitsingh91040@gmail.com";
  const pass = "jdennusvmwnfchjb";

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: {
      user,
      pass,
    },
    logger: process.env.MAIL_DEBUG === "true",
    debug: process.env.MAIL_DEBUG === "true",
    transactionLog: process.env.MAIL_DEBUG === "true",
  });
};

const sendWithSmtp = async ({ to, subject, html, text, from }) => {
  const transporter = createSmtpTransporter();

  const info = await transporter.sendMail({
    from: `"SkillBridge" <${from}>`,
    to,
    subject,
    text: text || htmlToText(html),
    html,
    envelope: {
      from,
      to,
    },
  });

  const accepted = info.accepted || [];
  const rejected = info.rejected || [];

  console.log("============== EMAIL DEBUG ==============");
  console.log("Provider: SMTP");
  console.log("Accepted:", accepted);
  console.log("Rejected:", rejected);
  console.log("Pending:", info.pending || []);
  console.log("Envelope:", info.envelope);
  console.log("Response:", info.response);
  console.log("Message ID:", info.messageId);
  console.log("=========================================");

  if (accepted.length === 0 || rejected.length > 0) {
    throw new Error(
      `SMTP did not accept the email. Accepted: ${accepted.join(", ") || "none"}; Rejected: ${rejected.join(", ") || "none"}`
    );
  }

  return {
    ...info,
    provider: "smtp",
  };
};

const mailSender = async (emailOrOptions, title, body) => {
  const input = getMailInput(emailOrOptions, title, body);
  const from = "ankitsingh91040@gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY || "re_fL4mQ468_6T3tSFQv9jFLSVydTdLtBx1k";
  const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!input.to || !input.subject || !input.html) {
    throw new Error("Email requires to, subject, and html fields.");
  }

  // 1. Try sending via Resend API (HTTPS port 443 - allowed on Render free tier)
  if (resendApiKey && resendFrom) {
    try {
      return await sendWithResend({
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        from: resendFrom,
        apiKey: resendApiKey,
      });
    } catch (resendError) {
      console.error("Resend API send failed:", resendError.message);
      // If we don't have SMTP credentials to fall back to, throw the Resend error
      if (!process.env.MAIL_USER && !process.env.MAIL_PASS) {
        throw resendError;
      }
    }
  }

  // 2. Fallback to SMTP (might time out on Render free tier due to port blocks)
  try {
    return await sendWithSmtp({ ...input, from });
  } catch (error) {
    const message = error?.message || "Unknown email sending error";

    if (/535|BadCredentials|Username and Password not accepted/i.test(message)) {
      throw new Error(
        "SMTP login failed. For Gmail use a 16-character App Password; for Brevo use the SMTP login and SMTP key, not the API key."
      );
    }

    throw error;
  }
};

module.exports = mailSender;
