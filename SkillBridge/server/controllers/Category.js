const Category = require("../models/Category")
const Course = require("../models/Course")
const mongoose = require("mongoose")

// ================= CREATE CATEGORY =================
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    await Category.create({ name, description })

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ================= SHOW ALL CATEGORIES =================
exports.showAllCategorys = async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      { name: true, description: true }
    )

    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      data: categories,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}




exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      })
    }

    // 1️⃣ Selected Category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec()

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    // 2️⃣ Different Category
    const differentCategory = await Category.findOne({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()

    // 3️⃣ Most Selling Courses
    const mostSellingCourses = await Course.find({
      status: "Published",
    })
      .sort({ studentsEnrolled: -1 })
      .limit(10)
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    console.error("CATEGORY PAGE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}
