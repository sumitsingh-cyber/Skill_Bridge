const { getInstance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const CourseProgress = require("../models/CourseProgress");

const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");

/* ================= CAPTURE PAYMENT ================= */
exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid course IDs",
      });
    }

    let totalAmount = 0;

    for (const courseId of courses) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid course ID: ${courseId}`,
        });
      }

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const alreadyEnrolled = (course.studentsEnrolled || []).some(
        (id) => id.toString() === userId.toString()
      );

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course",
        });
      }

      totalAmount += course.price || 0;
    }

    // Handle free courses — direct enrollment, no payment
    if (totalAmount === 0) {
      await enrollStudents(courses, userId);
      return res.status(200).json({
        success: true,
        isFreeCourse: true,
        message: "Enrolled in course successfully",
      });
    }

    // Create Razorpay order — fail hard if credentials are missing or invalid
    let order;
    try {
      order = await getInstance().orders.create({
        amount: totalAmount * 100, // convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    } catch (rzpError) {
      console.error("Razorpay order creation failed:", rzpError?.error || rzpError.message);
      return res.status(502).json({
        success: false,
        message: "Payment gateway error. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: order,
      // Only return the key ID (not secret) — sourced from env var only
      keyId: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    console.error("capturePayment error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Could not initiate payment",
    });
  }
};

/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment data missing",
      });
    }

    const courseList = Array.isArray(courses) ? courses : [courses];

    if (!courseList.length) {
      return res.status(400).json({
        success: false,
        message: "No courses provided for enrollment",
      });
    }

    const razorpaySecret = process.env.RAZORPAY_SECRET;
    if (!razorpaySecret) {
      console.error("CRITICAL: RAZORPAY_SECRET environment variable is not set");
      return res.status(500).json({
        success: false,
        message: "Payment verification configuration error.",
      });
    }

    // Server-side HMAC signature verification — always required
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment could not be verified.",
      });
    }

    await enrollStudents(courseList, userId);

    return res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled successfully",
    });

  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

/* ================= PAYMENT SUCCESS EMAIL ================= */
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("sendPaymentSuccessEmail error:", error);
    return res.status(500).json({ success: false });
  }
};

/* ================= ENROLL STUDENTS (internal) ================= */
const enrollStudents = async (courses, userId) => {
  let session = null;
  let useTransaction = true;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (err) {
    console.warn("MongoDB transactions unavailable, proceeding without:", err.message);
    useTransaction = false;
    session = null;
  }

  try {
    for (const courseId of courses) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error(`Invalid course ID: ${courseId}`);
      }

      const updateOpts = useTransaction ? { new: true, session } : { new: true };

      const course = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { studentsEnrolled: userId } },
        updateOpts
      );

      if (!course) {
        throw new Error("Course not found during enrollment");
      }

      const progressData = {
        courseID: courseId,
        userId,
        completedVideos: [],
      };

      const progress = useTransaction
        ? await CourseProgress.create([progressData], { session })
        : [await CourseProgress.create(progressData)];

      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: progress[0]._id,
          },
        },
        updateOpts
      );

      const user = useTransaction
        ? await User.findById(userId).session(session)
        : await User.findById(userId);

      if (user) {
        try {
          await mailSender(
            user.email,
            `Successfully Enrolled in ${course.courseName}`,
            courseEnrollmentEmail(course.courseName, "")
          );
        } catch (mailErr) {
          console.error("Enrollment email error:", mailErr.message);
        }
      }
    }

    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }
  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};
