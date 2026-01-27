const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Create Rating and Review
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        //check if user enrolled or not 
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // Check if user already reviewed course
        const existingReview = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Course already reviewed"
            });
        }

        // Create review
        const newRating = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        });

        // Add rating to course
        await Course.findByIdAndUpdate(courseId, {
            $push: { ratingAndReview: newRating._id }
        });

        return res.status(200).json({
            success: true,
            message: "Rating and Review added successfully",
            data: newRating
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add rating and Review",
            error: error.message
        });
    }
};

// Get average rating for a course
exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        const result = await RatingAndReview.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        return res.status(200).json({
            success: true,
            averageRating: 0
            
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch average rating"
        });
    }
};

// Get all reviews and rating
exports.getAllRatingReview = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: -1 })
            .populate({ path: "user", select: "firstName lastName" })
            .populate({ path: "course", select: "courseName" });

        return res.status(200).json({
            success: true,
            message: "All reviews and ratings",
            data: allReviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};
