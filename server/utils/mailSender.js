const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Sends an email via Gmail SMTP using Nodemailer.
 *
 * Uses MAIL_USER and MAIL_PASS (Gmail App Password) from environment variables.
 * Port 465 with SSL is used because Render's free tier blocks port 587 (STARTTLS)
 * but allows 465. Gmail SMTP sends to ANY recipient email address.
 */
const mailSender = async (email, title, body) => {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  if (!mailUser || !mailPass) {
    const msg = "MAIL_USER or MAIL_PASS is not set in environment variables";
    console.error(msg);
    throw new Error(msg);
  }

  // Port 465 + secure:true = SSL (works on Render free tier)
  // Port 587 + secure:false = STARTTLS (blocked on Render free tier)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"SkillBridge" <${mailUser}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent via Gmail SMTP, messageId:", info.messageId, "to:", email);
    return info;
  } catch (error) {
    console.error("mailSender threw:", error.message);
    throw error;
  }
};

module.exports = mailSender;