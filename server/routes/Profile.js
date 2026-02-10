const express = require("express");
const router = express.Router();

const { auth, isStudent, isInstructor } = require("../middlewares/auth");

const {
  updateProfile,
  deleteAccount,
  getUserDetails,
  getEnrolledCourses,
  updateDisplayPicture,
  changePassword,
  getInstructorDashboard,
} = require("../controllers/Profile");

// Profile routes
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/changepassword", auth, changePassword);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses);

// Instructor dashboard
router.get(
  "/instructorDashboard",
  auth,
  isInstructor,
  getInstructorDashboard
);

module.exports = router;
