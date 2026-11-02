const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,   // Always stored in lowercase
    unique: true,      // Enforced at DB level — prevents duplicate accounts
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  Image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,      // Fixed: was String, which caused unreliable date comparisons
    default: null,
  },
  courseProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
