const express = require("express");
const router = express.Router();

const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");


// ================= Middlewares ================= //
const { auth, isAdmin, isStudent, isInstructor } = require("../middlewares/auth");

// ================= Controllers ================= //

// ----- Course Controllers ----- //
const {
    createCourse,
    showAllCourses,
    getCourseDetails,
    editCourse,
    deleteCourse,
    getInstructorCourses,
      getFullCourseDetails,
} = require("../controllers/Course");


// ----- Category Controllers ----- //
const {
    createCategory,
    showAllCategorys,   // FIXED
    categoryPageDetails
} = require("../controllers/Category");

// ----- Rating & Review Controllers ----- //
const {
    createRating,
    getAverageRating,
    getAllRatingReview
} = require("../controllers/RatingAndReview");

// ********************** Course Routes ********************** //

// Create course (Only Admin)

// Add Section to a course

router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection/:SubSectionId", auth, isInstructor, deleteSubSection);


router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.get("/getInstructorCourses", auth,  isInstructor,  getInstructorCourses);
router.delete("/deleteCourse/:courseId", auth,  isInstructor, deleteCourse)
// Edit course
router.put("/editCourse", auth, isInstructor, editCourse)



router.post(
  "/getFullCourseDetails",
  auth,
  isStudent,
  getFullCourseDetails
);



router.post("/createCourse", auth, isInstructor, createCourse);

// Get all courses
router.get("/showAllCourses", showAllCourses);

// Get course details
router.post("/getCourseDetails", getCourseDetails);

// Edit course (Admin)






// ********************** Category Routes ********************** //

// Create category (Admin)
router.post("/createCategory", auth, isAdmin, createCategory);

// Get all categories
router.get("/showAllCategories", showAllCategorys);


// Get category page details
router.post("/getCategoryPageDetails", categoryPageDetails)



// ********************** Rating and Review ********************** //

// Create rating - only student
router.post("/createRating", auth, isStudent, createRating);

// Get average rating of a course
router.post("/getAverageRating", getAverageRating);

// Get all reviews
router.get("/getReviews", getAllRatingReview);






module.exports = router;
