const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// ================ RESET PASSWORD TOKEN ================
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // Return a generic message regardless of whether the email is registered
    // to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email address is registered, you will receive a reset link shortly.",
      });
    }

    // Generate a cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token and 5-minute expiry
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
      { new: true }
    );

    // Build reset URL using the configured frontend origin
    const frontendUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://skill-bridge-ruddy-beta.vercel.app"
        : "http://localhost:5173");

    const resetUrl = `${frontendUrl}/update-password/${token}`;

    await mailSender(
      email,
      "SkillBridge — Password Reset Link",
      `<p>You requested a password reset for your SkillBridge account.</p>
       <p>Click the link below to reset your password. This link expires in 5 minutes.</p>
       <a href="${resetUrl}">${resetUrl}</a>
       <p>If you did not request this, you can safely ignore this email.</p>`
    );

    return res.status(200).json({
      success: true,
      message: "If that email address is registered, you will receive a reset link shortly.",
    });

  } catch (error) {
    console.error("resetPasswordToken error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request.",
    });
  }
};

// ================ RESET PASSWORD ================
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and contain at least one number",
      });
    }

    // Look up user by reset token
    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has already been used.",
      });
    }

    // Check token expiry
    if (userDetails.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new password reset link.",
      });
    }

    // Hash and save new password, then invalidate the reset token
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: null,                    // Invalidate — token is single-use
        resetPasswordExpires: null,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });

  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed. Please try again.",
    });
  }
};
