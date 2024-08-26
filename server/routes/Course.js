// Import the required modules
const express = require("express")
const router = express.Router()

// Course Controllers Import
const {
    createCourse,
    showAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course")

// Categories Controllers Import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const{
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const{
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/subSection")

//rating controller import
const{
    createRating,
    getAvgRating,
    getAllRatings,
} = require("../controllers/RatingAndReviews")

// Importing Middlewares
const {auth, isInstructor, isStudent, isAdmin} = require("..//middlewares/auth")

const {updateCourseProgress} = require("../controllers/courseProgress")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/createSection",auth, isInstructor,createSection)
// Update a Section
router.post("/updateSection",auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection",auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection",auth, isInstructor, deleteSubSection)
//Add a SubSection to a Section
router.post("/createSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses",showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory",auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAvgRating)
router.get("/getReviews", getAllRatings)

module.exports = router