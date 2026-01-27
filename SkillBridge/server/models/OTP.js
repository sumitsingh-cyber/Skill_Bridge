const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }     // 👈 automatically creates createdAt & updatedAt
);

// Automatically delete OTP after 5 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verification Email from SkillBridge",
      otpTemplate(otp)
    );
  } catch (error) {
    console.log("Error sending email: ", error);
    throw error;
  }
}

OTPSchema.pre("save", async function () {
  await sendVerificationEmail(this.email, this.otp);
});

module.exports = mongoose.model("OTP", OTPSchema);
