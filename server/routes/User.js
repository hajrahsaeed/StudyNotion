//Importing required modeules
const express = require("express")
const router = express.Router()

//import the required controller and middleware function
const{
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth")

const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")

const {auth} = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

//Route for user login
router.post("/login",login)

//Router for user signup
router.post("/signup",signUp)

//router for sending otp to the user email
router.post("/sendotp",sendOTP)

//// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
