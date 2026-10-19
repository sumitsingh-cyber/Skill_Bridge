const express = require("express");
const router = express.Router();

const { auth, isAdmin } = require("../middlewares/auth");
const {
  getAdminDashboard,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPlatformCourses,
  updateCourseStatus,
  deleteCategory,
} = require("../controllers/Admin");

// All routes require auth and isAdmin
router.use(auth);
router.use(isAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAllUsers);
router.put("/user-role", updateUserRole);
router.delete("/user/:userId", deleteUser);
router.get("/courses", getAllPlatformCourses);
router.put("/course-status", updateCourseStatus);
router.delete("/category/:categoryId", deleteCategory);

module.exports = router;
