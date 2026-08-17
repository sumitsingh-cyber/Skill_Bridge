const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  
  if (!email || !firstname || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  try {
    const adminEmail = process.env.MAIL_USER || process.env.MAIL_FROM || "ankitsingh91040@gmail.com";
    
    // Send email to admin
    await mailSender(
      adminEmail,
      "New Contact Us Submission - SkillBridge",
      `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Message Received</h2>
        <p><strong>Name:</strong> ${firstname} ${lastname || ""}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${countrycode || ""} ${phoneNo || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f4f4f4; padding: 10px; border-left: 3px solid #0070f3;">
          ${message}
        </blockquote>
      </div>`
    );

    // Send confirmation email to user
    await mailSender(
      email,
      "We received your message - SkillBridge",
      `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thank you for contacting SkillBridge!</h2>
        <p>Hi ${firstname},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your Message:</strong></p>
        <p><em>"${message}"</em></p>
        <br/>
        <p>Best regards,<br/>SkillBridge Team</p>
      </div>`
    );

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("CONTACT US ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending message",
      error: error.message,
    });
  }
};
