const mongoose = require("mongoose");

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
  { timestamps: true } // automatically creates createdAt & updatedAt
);

// Automatically delete OTP after 5 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("OTP", OTPSchema);
