const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// ================= CREATE COURSE =================
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      instructions,
      status = "Published", // ✅ DEFAULT PUBLISHED (Catalog needs this)
    } = req.body

    const thumbnail = req.files?.thumbnailImage

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      })
    }

    const instructorId = req.user.id
    const instructor = await User.findById(instructorId)
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      })
    }

    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    const uploadedThumbnail = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )

    let parsedTags = []
    let parsedInstructions = []

    if (tag) {
      try {
        parsedTags = JSON.parse(tag)
      } catch {}
    }

    if (instructions) {
      try {
        parsedInstructions = JSON.parse(instructions)
      } catch {}
    }

    const course = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price: Number(price),
      category: categoryDetails._id,
      tag: parsedTags,
      instructions: parsedInstructions,
      status,
      thumbnail: uploadedThumbnail.secure_url,
    })

    // ✅ Add course to instructor
    await User.findByIdAndUpdate(instructorId, {
      $push: { courses: course._id },
    })

    // ✅🔥 Add course to category (FIXES CATALOG)
    await Category.findByIdAndUpdate(categoryDetails._id, {
      $push: { courses: course._id },
    })

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    })
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    })
  }
}

// ================= GET COURSE DETAILS =================
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID required",
      })
    }

    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error("GET COURSE DETAILS ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
    })
  }
}

// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      })
    }

    // ✅ Remove from students
    await User.updateMany(
      { _id: { $in: course.studentsEnrolled || [] } },
      { $pull: { courses: courseId } }
    )

    // ✅ Remove from instructor
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    })

    // ✅🔥 Remove from category (IMPORTANT)
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId },
    })

    // ✅ Delete sections & subsections
    for (const sectionId of course.courseContent || []) {
      const section = await Section.findById(sectionId)
      if (section?.subSection?.length) {
        await SubSection.deleteMany({
          _id: { $in: section.subSection },
        })
      }
      await Section.findByIdAndDelete(sectionId)
    }

    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// ================= SHOW ALL COURSES =================
exports.showAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        category: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor", "firstName lastName")
      .populate("category", "name")

    return res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    console.error("SHOW ALL COURSES ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    })
  }
}

// ================= EDIT COURSE =================
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const updates = req.body

    // ✅ Handle category change safely
    if (updates.category && updates.category !== course.category.toString()) {
      await Category.findByIdAndUpdate(course.category, {
        $pull: { courses: course._id },
      })

      await Category.findByIdAndUpdate(updates.category, {
        $push: { courses: course._id },
      })

      course.category = updates.category
    }

    for (const key in updates) {
      if (!["courseId", "tag", "instructions", "category"].includes(key)) {
        course[key] = updates[key]
      }
    }

    if (updates.tag) {
      try {
        course.tag = JSON.parse(updates.tag)
      } catch {
        course.tag = []
      }
    }

    if (updates.instructions) {
      try {
        course.instructions = JSON.parse(updates.instructions)
      } catch {
        course.instructions = []
      }
    }

    if (req.files?.thumbnailImage) {
      const uploadedImage = await uploadImageToCloudinary(
        req.files.thumbnailImage,
        process.env.FOLDER_NAME
      )
      course.thumbnail = uploadedImage.secure_url
    }

    await course.save()

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    })
  } catch (error) {
    console.error("EDIT COURSE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    })
  }
}

// ================= INSTRUCTOR COURSES =================
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id

    const courses = await Course.find({ instructor: instructorId }).sort({
      createdAt: -1,
    })

    return res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
    })
  }
}

// ================= FULL COURSE DETAILS =================
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",   // ✅ THIS IS THE FIX
        },
      })
      .populate("instructor")
      .populate("category")

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: [],
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
    })
  }
}

