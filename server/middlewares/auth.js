const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth middleware
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header("Authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.Token || req.cookies?.token) {
      token = req.cookies.Token || req.cookies.token;
    } else if (req.body?.token) {
      token = req.body.token;
    } else if (authHeader) {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please log in.",
      });
    }

    // Strip leading/trailing quotes or whitespace if serialized
    token = String(token).replace(/^["']|["']$/g, "").trim();

    const secret = process.env.JWT_SECRET || "manish";
    let decoded;

    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        // Authentically signed token by our secret: allow up to 30 days grace window
        decoded = jwt.verify(token, secret, { ignoreExpiration: true });
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && now - decoded.exp > 30 * 24 * 60 * 60) {
          return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again.",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
      }
    }

    req.user = decoded;
    if (decoded.id && !req.user._id) req.user._id = decoded.id;
    if (decoded._id && !req.user.id) req.user.id = decoded._id;

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
    let role = req.user?.accountType?.toLowerCase();
    if (!role && req.user?.id) {
      const dbUser = await User.findById(req.user.id);
      role = dbUser?.accountType?.toLowerCase();
    }

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
    let role = req.user?.accountType?.toLowerCase();
    if (!role && req.user?.id) {
      const dbUser = await User.findById(req.user.id);
      role = dbUser?.accountType?.toLowerCase();
    }

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
    let role = req.user?.accountType?.toLowerCase();
    if (!role && req.user?.id) {
      const dbUser = await User.findById(req.user.id);
      role = dbUser?.accountType?.toLowerCase();
    }

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

