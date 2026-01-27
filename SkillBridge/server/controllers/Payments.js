const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const CourseProgress = require("../models/CourseProgress")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")

/* ================= CAPTURE PAYMENT ================= */
exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body
    const userId = req.user.id

    console.log("🟡 capturePayment called")
    console.log("🟡 User ID:", userId)
    console.log("🟡 Courses received:", courses)

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      console.log("🔴 Invalid courses payload")
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs",
      })
    }

    let totalAmount = 0

    for (const courseId of courses) {
      console.log("➡️ Checking course:", courseId)

      const course = await Course.findById(courseId)

      if (!course) {
        console.log("🔴 Course not found:", courseId)
        return res.status(404).json({
          success: false,
          message: "Course not found",
        })
      }

      const alreadyEnrolled = course.studentsEnrolled.some(
        (id) => id.toString() === userId.toString()
      )

      if (alreadyEnrolled) {
        console.log("⚠️ User already enrolled in:", courseId)
        return res.status(400).json({
          success: false,
          message: "Student already enrolled in this course",
        })
      }

      totalAmount += course.price
    }

    console.log("💰 Total amount:", totalAmount)

    const order = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    })

    console.log("✅ Razorpay order created:", order.id)

    return res.status(200).json({
      success: true,
      message: order,
    })
  } catch (error) {
    console.error("❌ capturePayment error:", error)
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
    })
  }
}

/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  try {
    let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = req.body

    const userId = req.user.id

    console.log("🟡 verifyPayment called")
    console.log("🟡 User ID:", userId)
    console.log("🟡 Raw courses:", courses)

    // 🔒 FORCE ARRAY
    courses = Array.isArray(courses) ? courses : [courses]

    console.log("🟢 Normalized courses:", courses)

    if (!courses.length) {
      console.log("🔴 No courses after normalization")
      return res.status(400).json({
        success: false,
        message: "No courses provided for enrollment",
      })
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex")

    console.log("🟡 Expected signature:", expectedSignature)
    console.log("🟡 Received signature:", razorpay_signature)

    if (expectedSignature !== razorpay_signature) {
      console.log("🔴 Signature mismatch")
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      })
    }

    console.log("✅ Signature verified")

    await enrollStudents(courses, userId)

    console.log("✅ Enrollment completed")

    return res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled",
    })
  } catch (error) {
    console.error("❌ verifyPayment error:", error)
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    })
  }
}

/* ================= EMAIL ================= */
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body
    const userId = req.user.id

    console.log("🟡 sendPaymentSuccessEmail called")
    console.log("🟡 Order:", orderId, "Payment:", paymentId)

    const user = await User.findById(userId)

    await mailSender(
      user.email,
      "Payment Received",
      paymentSuccessEmail(
        `${user.firstName} ${user.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )

    console.log("✅ Payment success email sent")

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("❌ email error:", error)
    res.status(500).json({ success: false })
  }
}

/* ================= GET ENROLLED COURSES ================= */
// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.user.id

//     const user = await User.findById(userId)
//       .populate("courses")   // 🔥 NO FILTERS
//       .exec()

//     console.log("🟢 USER COURSES FROM DB:", user.courses)

//     return res.status(200).json({
//       success: true,
//       data: user.courses || [],
//     })
//   } catch (error) {
//     console.error("❌ getEnrolledCourses error:", error)
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }


/* ================= ENROLL STUDENTS ================= */
const enrollStudents = async (courses, userId) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    console.log("🟡 enrollStudents started")
    console.log("🟡 Courses:", courses)
    console.log("🟡 User ID:", userId)

    for (const courseId of courses) {
      console.log("➡️ Enrolling in course:", courseId)

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error(`Invalid course ID: ${courseId}`)
      }

      const course = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { studentsEnrolled: userId } },
        { new: true, session }
      )

      if (!course) {
        throw new Error("Course not found during enrollment")
      }

      console.log("✅ Course updated:", course.courseName)

      const progress = await CourseProgress.create(
        [
          {
            courseID: courseId,
            userId,
            completedVideos: [],
          },
        ],
        { session }
      )

      console.log("✅ Course progress created:", progress[0]._id)

      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: progress[0]._id,
          },
        },
        { session }
      )

      console.log("✅ User updated with course")

      const user = await User.findById(userId).session(session)

      await mailSender(
        user.email,
        `Successfully Enrolled in ${course.courseName}`,
        courseEnrollmentEmail(course.courseName, "")
      )

      console.log("📧 Enrollment email sent")
    }

    await session.commitTransaction()
    session.endSession()

    console.log("🟢 enrollStudents transaction committed")
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error("❌ enrollStudents failed:", error)
    throw error
  }
}
