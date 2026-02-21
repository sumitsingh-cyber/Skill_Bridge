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
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs",
      })
    }

    let totalAmount = 0

    for (const courseId of courses) {
      const course = await Course.findById(courseId)

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        })
      }

      const alreadyEnrolled = course.studentsEnrolled.some(
        (id) => id.toString() === userId.toString()
      )

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "Student already enrolled in this course",
        })
      }

      totalAmount += course.price
    }

    const order = await instance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    })

    return res.status(200).json({
      success: true,
      message: order,
    })
  } catch (error) {
    console.error("capturePayment error:", error)
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

    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment data missing",
      })
    }

    courses = Array.isArray(courses) ? courses : [courses]

    if (!courses.length) {
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

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      })
    }

    await enrollStudents(courses, userId)

    return res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled",
    })
  } catch (error) {
    console.error("verifyPayment error:", error)
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    })
  }
}

/* ================= PAYMENT SUCCESS EMAIL ================= */
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

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

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("email error:", error)
    return res.status(500).json({ success: false })
  }
}

/* ================= ENROLL STUDENTS ================= */
const enrollStudents = async (courses, userId) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    for (const courseId of courses) {
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

      const user = await User.findById(userId).session(session)

      if (user) {
        await mailSender(
          user.email,
          `Successfully Enrolled in ${course.courseName}`,
          courseEnrollmentEmail(course.courseName, "")
        )
      }
    }

    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
