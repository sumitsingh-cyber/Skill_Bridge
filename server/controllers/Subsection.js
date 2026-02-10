const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// ================= CREATE SUBSECTION =================
exports.createSubSection = async (req, res) => {
  try {
    // 🔍 Debug (keep while testing)
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { sectionId, courseId, title, timeDuration, description } = req.body;
    const video = req.files?.video;

    // ✅ Validation
    if (
      !sectionId ||
      !courseId ||
      !title ||
      !timeDuration ||
      !description ||
      !video
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Upload video
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // ✅ Create SubSection
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // ✅ Push subsection into section
    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSection: subSection._id },
    });

    // ✅ RETURN FULL UPDATED COURSE (CRITICAL FOR NEXT BUTTON)
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("CREATE SUBSECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ================= UPDATE SUBSECTION =================
exports.updateSubSection = async (req, res) => {
  try {
    const {
      subSectionId,
      sectionId,
      courseId,
      title,
      description,
      timeDuration,
    } = req.body;

    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID, Section ID, and Course ID are required",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (timeDuration) updateData.timeDuration = timeDuration;

    // update subsection
    await SubSection.findByIdAndUpdate(subSectionId, updateData, {
      new: true,
    });

    // ✅ return full updated course
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
      message: "Unable to update SubSection",
      error: error.message,
    });
  }
};

// ================= DELETE SUBSECTION =================
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, courseId } = req.body;

    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID, Section ID, and Course ID are required",
      });
    }

    // remove subsection reference from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    // delete subsection
    await SubSection.findByIdAndDelete(subSectionId);

    // ✅ return full updated course
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
      message: "Unable to delete SubSection",
      error: error.message,
    });
  }
};
