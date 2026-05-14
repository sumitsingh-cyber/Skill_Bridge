require("dotenv").config();

/**
 * Sends an email via Brevo (formerly Sendinblue) HTTPS REST API.
 *
 * WHY BREVO:
 *   - Render free tier blocks ALL outbound SMTP ports (25, 465, 587)
 *     so Nodemailer/Gmail SMTP cannot connect.
 *   - Resend's free "onboarding@resend.dev" address only delivers to the
 *     Resend account owner's email — useless for real users.
 *   - Brevo uses a pure HTTPS API call (no SMTP), works on Render free tier,
 *     and sends to ANY recipient with 300 free emails/day.
 *
 * SETUP (one-time):
 *   1. Sign up free at https://app.brevo.com
 *   2. Go to Profile → SMTP & API → API Keys → Generate new API key
 *   3. Add sender: Senders & IPs → Senders → Add a sender (use your Gmail)
 *      (Brevo will send a verification email — click it)
 *   4. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in your Render env vars
 */
const mailSender = async (email, title, body) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.MAIL_USER;

  if (!apiKey) {
    const msg = "BREVO_API_KEY is not set in environment variables";
    console.error(msg);
    throw new Error(msg);
  }

  if (!senderEmail) {
    const msg = "BREVO_SENDER_EMAIL (or MAIL_USER) is not set in environment variables";
    console.error(msg);
    throw new Error(msg);
  }

  const payload = {
    sender: { name: "SkillBridge", email: senderEmail },
    to: [{ email }],
    subject: title,
    htmlContent: body,
  };

  // fetch is available natively in Node 18+ (Render uses Node 18+ by default)
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    const errMsg = result.message || JSON.stringify(result);
    console.error("Brevo API error:", errMsg);
    throw new Error(errMsg);
  }

  console.log("Email sent via Brevo, messageId:", result.messageId, "to:", email);
  return result;
};

module.exports = mailSender;