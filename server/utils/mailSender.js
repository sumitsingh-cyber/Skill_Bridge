const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Sends email via Brevo SMTP relay (smtp-relay.brevo.com).
 *
 * WHY BREVO SMTP RELAY (not Gmail):
 *   Gmail blocks sign-ins from cloud server IPs (Render, Heroku, etc.)
 *   Brevo's dedicated relay is built for programmatic sending from servers.
 *
 * CREDENTIALS NEEDED in .env / Render env vars:
 *   BREVO_SMTP_KEY   = xsmtpsib-...  (from Brevo → SMTP & API → SMTP)
 *   MAIL_USER        = ankitsingh91040@gmail.com  (your Brevo account email)
 */
const mailSender = async (email, title, body) => {
  const smtpUser = process.env.MAIL_USER;
  const smtpKey  = process.env.BREVO_SMTP_KEY;

  if (!smtpUser || !smtpKey) {
    const msg = "MAIL_USER or BREVO_SMTP_KEY is not set in environment variables";
    console.error(msg);
    throw new Error(msg);
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // STARTTLS on port 587
    auth: {
      user: smtpUser,   // your Brevo account email
      pass: smtpKey,    // xsmtpsib-... key
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"SkillBridge" <${smtpUser}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent via Brevo SMTP, messageId:", info.messageId, "to:", email);
    return info;
  } catch (error) {
    console.error("mailSender threw:", error.message);
    throw error;
  }
};

module.exports = mailSender;