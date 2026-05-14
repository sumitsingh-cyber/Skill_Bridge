const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Sends an email using Gmail SMTP (Nodemailer).
 * Gmail supports sending to ANY recipient, unlike Resend's free tier
 * which only allows sending to the verified account email.
 */
const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: false, // TLS via STARTTLS on port 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail App Password (not your login password)
      },
    });

    const info = await transporter.sendMail({
      from: `"SkillBridge" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent via Nodemailer:", info.messageId);
    return info;
  } catch (error) {
    console.log("mailSender error:", error.message);
    throw error;
  }
};

module.exports = mailSender;