const Schedule = require("node-schedule");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
exports.updateProfile =async (req,res) =>{
    try{
        //get data 
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get userId
        const id=req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //find profile
        const userDetails=await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails=await  Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth= dateOfBirth;
        profileDetails.about =about;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();

        //return response 
      return res.status(200).json({
  success: true,
  message: "Profile Updated Successfully",
  updatedUserDetails: {
    ...userDetails._doc,
    additionalDetails: profileDetails,
  },
});


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Profile is not  updated",
            error:error.message,
        })
    }
}


exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    // Remove user from enrolled courses
    if (user.courses && user.courses.length > 0) {
      for (const courseId of user.courses) {
        await Course.findByIdAndUpdate(courseId, {
          $pull: { studentsEnrolled: userId },
        });
      }
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });

  } catch (error) {
    console.log("DELETE ACCOUNT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    console.log(userDetails);

    return res.status(200).json({
      success: true,
      message: "User Data Fetched successfully",
      data: userDetails,    // 🔥 Add this line
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User data not fetched",
      error: error.message
    });
  }
};

// get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id

    const courses = await Course.find({
      studentsEnrolled: userId,
    })
      .populate("instructor")
      .populate({
        path: "courseContent",
        model: "Section",          // 👈 FORCE MODEL
        populate: {
          path: "subSection",
          model: "SubSection",     // 👈 FORCE MODEL
        },
      })

    return res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    console.error("❌ getEnrolledCourses error:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



// Update Display Picture (Placeholder for now)
exports.updateDisplayPicture = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Display picture updated successfully (placeholder)"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update display picture",
        });
    }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await mailSender(
      user.email,
      "Password Updated Successfully",
      passwordUpdated(user.email)
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};



exports.getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id

    const courses = await Course.find({ instructor: instructorId })

    const totalCourses = courses.length

    const totalStudents = courses.reduce(
      (acc, course) => acc + (course.studentsEnrolled?.length || 0),
      0
    )

    const totalEarnings = courses.reduce(
      (acc, course) =>
        acc + (course.studentsEnrolled?.length || 0) * course.price,
      0
    )

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalEarnings,
        courses,
      },
    })
  } catch (error) {
    console.error("INSTRUCTOR DASHBOARD ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to load instructor dashboard",
    })
  }
}
