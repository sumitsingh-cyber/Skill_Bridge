const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");

// ================= CREATE SECTION =================
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Course ID required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newSection = await Section.create({
      sectionName,
      subSection: [],
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("CREATE SECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: error.message,
    });
  }
};

// ================= UPDATE SECTION =================
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Section ID required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};

// ================= DELETE SECTION =================
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Course ID required",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Remove section reference from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // Delete all subsections under this section
    await SubSection.deleteMany({
      _id: { $in: Section.subSection },
    });

    // Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    // Return updated course
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section",
      error: error.message,
    });
  }
};
