const { Resend } = require("resend");
require("dotenv").config();

/**
 * Sends an email via Resend API.
 *
 * Why Resend instead of Nodemailer:
 *   Render's free tier blocks outbound SMTP ports (25, 465, 587),
 *   so Nodemailer cannot connect. Resend uses HTTPS API calls instead.
 *
 * Why new Resend() is inside the function:
 *   On Render, env vars are injected at runtime. If the client is created
 *   at module load time (top-level), RESEND_API_KEY may still be undefined.
 *   Creating it lazily ensures the key is always available.
 */
const mailSender = async (email, title, body) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const msg = "RESEND_API_KEY is not set in environment variables";
    console.error(msg);
    throw new Error(msg);
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "SkillBridge <onboarding@resend.dev>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.error("Resend API error:", JSON.stringify(error));
      throw new Error(error.message || JSON.stringify(error));
    }

    console.log("Email sent via Resend, id:", data.id, "to:", email);
    return data;
  } catch (error) {
    console.error("mailSender threw:", error.message);
    throw error;
  }
};

module.exports = mailSender;