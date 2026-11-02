const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");

// ================ SEND OTP ================
exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // 60-second resend cooldown
    const recentOtpRequest = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (recentOtpRequest && Date.now() - recentOtpRequest.createdAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    const otp = String(randomInt(100000, 1000000));
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Delete previous OTPs for this email
    await OTP.deleteMany({ email });

    // Save hashed OTP
    await OTP.create({ email, otp: hashedOtp });

    const htmlContent = otpTemplate(otp);

    // Send email — if it fails, return a real error, NEVER expose the OTP
    try {
      await mailSender({
        to: email,
        subject: "Your SkillBridge verification code",
        html: htmlContent,
      });
    } catch (mailError) {
      console.error("Failed to send OTP email:", mailError.message);
      // Clean up the OTP record since we couldn't deliver it
      await OTP.deleteMany({ email });
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("sendOTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


// ================ SIGNUP ================
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    const email = rawEmail?.trim().toLowerCase();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Password strength — minimum 8 chars, at least one number
    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and contain at least one number",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // Find most recent OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    const isOtpValid = await bcrypt.compare(String(otp), recentOtp[0].otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize account type — ADMIN registration is NOT allowed via the public signup API.
    // Admins must be provisioned server-side via environment variables only.
    let normalizedAccountType = "Student";
    if (accountType && accountType.toLowerCase() === "instructor") {
      normalizedAccountType = "Instructor";
    }

    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType: normalizedAccountType,
      additionalDetails: profileDetails._id,
      Image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    // Invalidate the OTP after successful registration
    await OTP.deleteMany({ email });

    // Strip sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.token;

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};


// ================ LOGIN ================
exports.login = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required. Please try again.",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up first.",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("CRITICAL: JWT_SECRET environment variable is not set");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact support.",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "30d",
    });

    user.token = token;
    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res.cookie("Token", token, cookieOptions).status(200).json({
      success: true,
      token,
      user,
      message: "Logged in successfully",
    });

  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};


// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters and contain at least one number",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    try {
      await mailSender(
        user.email,
        "Password Updated Successfully",
        passwordUpdated(user.email)
      );
    } catch (mailErr) {
      console.error("Password change notification email failed:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
