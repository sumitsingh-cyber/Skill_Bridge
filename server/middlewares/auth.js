const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth middleware
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.Token || req.cookies?.token) {
      token = req.cookies.Token || req.cookies.token;
    } else if (req.body?.token) {
      token = req.body.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "manish");
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// isStudent middleware
exports.isStudent = async (req, res, next) => {
  try {
    const role = req.user?.accountType?.toLowerCase();
    if (role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: Student access only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// isInstructor middleware
exports.isInstructor = async (req, res, next) => {
  try {
    const role = req.user?.accountType?.toLowerCase();
    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: Instructor access only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// isAdmin middleware
exports.isAdmin = async (req, res, next) => {
  try {
    const role = req.user?.accountType?.toLowerCase();
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: Admin access only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

