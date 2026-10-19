const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/category");
const Profile = require("../models/Profile");

// ================= ADMIN DASHBOARD STATS =================
exports.getAdminDashboard = async (req, res) => {
  try {
    const [users, courses, categories] = await Promise.all([
      User.find({}).select("-password").sort({ createdAt: -1 }).lean(),
      Course.find({}).populate("instructor", "firstName lastName email").populate("category", "name").sort({ createdAt: -1 }).lean(),
      Category.find({}).lean(),
    ]);

    const totalUsers = users.length;
    const totalStudents = users.filter((u) => u.accountType?.toLowerCase() === "student").length;
    const totalInstructors = users.filter((u) => u.accountType?.toLowerCase() === "instructor").length;
    const totalAdmins = users.filter((u) => u.accountType?.toLowerCase() === "admin").length;

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === "Published").length;
    const draftCourses = courses.filter((c) => c.status === "Draft" || !c.status).length;

    // Calculate total revenue from all course enrollments
    const totalRevenue = courses.reduce((acc, course) => {
      const enrolledCount = course.studentsEnrolled?.length || 0;
      const price = Number(course.price) || 0;
      return acc + enrolledCount * price;
    }, 0);

    const recentUsers = users.slice(0, 8);
    const recentCourses = courses.slice(0, 6);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalInstructors,
          totalAdmins,
          totalCourses,
          publishedCourses,
          draftCourses,
          totalCategories: categories.length,
          totalRevenue,
        },
        recentUsers,
        recentCourses,
        categories,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};

    if (role && role !== "All") {
      query.accountType = { $regex: new RegExp(`^${role}$`, "i") };
    }

    const users = await User.find(query)
      .select("-password")
      .populate("additionalDetails")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ================= UPDATE USER ROLE =================
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({
        success: false,
        message: "User ID and new role are required",
      });
    }

    const validRoles = ["Student", "Instructor", "Admin"];
    const matchedRole = validRoles.find(
      (r) => r.toLowerCase() === newRole.toLowerCase()
    );

    if (!matchedRole) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Must be Student, Instructor, or Admin.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { accountType: matchedRole },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${matchedRole} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Prevent admin from deleting themselves
    if (userId.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete linked profile
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    // Pull from enrolled courses
    await Course.updateMany(
      { studentsEnrolled: userId },
      { $pull: { studentsEnrolled: userId } }
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// ================= GET ALL COURSES (FOR ADMIN) =================
exports.getAllPlatformCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET ALL PLATFORM COURSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform courses",
      error: error.message,
    });
  }
};

// ================= UPDATE COURSE STATUS (ADMIN) =================
exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId, status } = req.body;

    if (!courseId || !status) {
      return res.status(400).json({
        success: false,
        message: "Course ID and status are required",
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Course status updated to ${status}`,
      data: course,
    });
  } catch (error) {
    console.error("UPDATE COURSE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course status",
      error: error.message,
    });
  }
};

// ================= DELETE CATEGORY =================
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
