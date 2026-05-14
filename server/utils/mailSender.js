const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds — fail fast instead of hanging
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    let info = await transporter.sendMail({
      from: `"SkillBridge" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("mailSender error:", error.message);
    throw error; // re-throw so callers know it failed
  }
};

module.exports = mailSender;