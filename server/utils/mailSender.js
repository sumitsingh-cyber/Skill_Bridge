const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SkillBridge <onboarding@resend.dev>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.log("Resend error:", error);
      throw new Error(error.message || JSON.stringify(error));
    }

    console.log("Email sent via Resend:", data.id);
    return data;
  } catch (error) {
    console.log("mailSender error:", error.message);
    throw error;
  }
};

module.exports = mailSender;