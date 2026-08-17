const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
const User = require("../models/User");

exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId, subsectionId } = req.body;
    const targetSubSectionId = subSectionId || subsectionId;
    const userId = req.user.id;

    if (!courseId || !targetSubSectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and SubSection ID are required",
      });
    }

    const subSection = await SubSection.findById(targetSubSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Invalid SubSection ID",
      });
    }

    let progress = await CourseProgress.findOne({
      courseID: courseId,
      userId,
    });

    if (!progress) {
      // Find from user's courseProgress array if available
      const user = await User.findById(userId).populate("courseProgress");
      if (user && user.courseProgress) {
        progress = user.courseProgress.find(
          (p) => p.courseID && p.courseID.toString() === courseId.toString()
        );
      }
    }

    if (!progress) {
      // Create new course progress entry
      progress = await CourseProgress.create({
        courseID: courseId,
        userId,
        completedVideos: [targetSubSectionId],
      });

      await User.findByIdAndUpdate(userId, {
        $push: { courseProgress: progress._id },
      });

      return res.status(200).json({
        success: true,
        message: "Course progress updated successfully",
      });
    }

    if (progress.completedVideos.includes(targetSubSectionId)) {
      return res.status(200).json({
        success: true,
        message: "Lecture already completed",
      });
    }

    progress.completedVideos.push(targetSubSectionId);
    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
    });
  } catch (error) {
    console.error("UPDATE COURSE PROGRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
