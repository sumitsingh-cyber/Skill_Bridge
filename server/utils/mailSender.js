const nodemailer = require("nodemailer");
const { Resend } = require("resend");
require("dotenv").config();

const htmlToText = (html = "") =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

const getBrevoKey = () => {
  return (
    process.env.BREVO_API_KEY ||
    process.env.BREVO_KEY ||
    process.env.BREVO_SMTP_KEY ||
    null
  );
};

const sendWithBrevoApi = async ({ to, subject, html, apiKey, from }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "SkillBridge", email: from },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(8000), // 8-second strict timeout
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `Brevo API error ${response.status}`);
  }

  console.log("Email sent via Brevo API | To:", to, "| MessageId:", data?.messageId);

  return {
    provider: "brevo",
    messageId: data?.messageId,
    accepted: [to],
    rejected: [],
  };
};

const sendWithResend = async ({ to, subject, html, text, from, apiKey }) => {
  const resend = new Resend(apiKey);

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

  console.log("Email sent via Resend | To:", to, "| MessageId:", data?.id);

  return {
    provider: "resend",
    messageId: data?.id,
    accepted: [to],
    rejected: [],
  };
};

const sendWithSmtp = async ({ to, subject, html, text, from }) => {
  const host = process.env.MAIL_HOST;
  const port = parseInt(process.env.MAIL_PORT, 10) || 587;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration incomplete — MAIL_HOST, MAIL_USER, MAIL_PASS required");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000, // 5s timeout prevents hanging on Render
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });

  const info = await transporter.sendMail({
    from: `"SkillBridge" <${from}>`,
    to,
    subject,
    text: text || htmlToText(html),
    html,
  });

  console.log("Email sent via SMTP | To:", to, "| MessageId:", info.messageId);

  return { ...info, provider: "smtp" };
};

/**
 * mailSender(emailOrOptions, title?, body?)
 * 
 * Provider priority: Brevo HTTP API (Port 443 HTTPS) -> Resend API -> SMTP
 * Sourced strictly from environment variables.
 */
const mailSender = async (emailOrOptions, title, body) => {
  const input = getMailInput(emailOrOptions, title, body);
  const from = process.env.MAIL_FROM || "ankitsingh91040@gmail.com";
  const brevoApiKey = getBrevoKey();
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!input.to || !input.subject || !input.html) {
    throw new Error("Email requires 'to', 'subject', and 'html' fields.");
  }

  // 1. Brevo HTTP API (HTTPS port 443)
  if (brevoApiKey && from) {
    try {
      return await sendWithBrevoApi({
        to: input.to,
        subject: input.subject,
        html: input.html,
        apiKey: brevoApiKey,
        from,
      });
    } catch (brevoError) {
      console.error("Brevo API failed:", brevoError.message);
    }
  }

  // 2. Resend API (HTTPS port 443)
  if (resendApiKey) {
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
      console.error("Resend API failed:", resendError.message);
    }
  }

  // 3. SMTP fallback (with 5s strict timeout)
  if (from && process.env.MAIL_HOST) {
    try {
      return await sendWithSmtp({ ...input, from });
    } catch (smtpError) {
      console.error("SMTP fallback failed:", smtpError.message);
    }
  }

  throw new Error("All configured email delivery providers failed.");
};

module.exports = mailSender;
