const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail_templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

//send OTP
exports.sendOTP = async (req,res) => {
    try{
        //fetch email from requests body
        const {email} = req.body;

        //check if user exists
        const checkUserPresent = await User.findOne({email});

        //if user already exists
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Genenrated -> ", otp);

        //check unique OTP or Not
        let result = await OTP.findOne({otp : otp});
        console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

        while(result){
            otp = otpGenerator(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = new OTP.findOne({otp: otp});
        }   

        const otpPayload = {email, otp};

        //create an entry in db for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //repsonse returninh
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp,
        })

  
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }


}

//sign up

exports.signUp =  async(req, res) => {
    try{

        //data fetchd from requests body
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

        //validate data
        if(!firstName  || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //2 passwords matching
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPssword Values doest not match.",
            })
        }

        //check user already exists or not
        const existingUser = await User.findOne({email}); 
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered",
            })
        }

        //find most recent otp stored for the user
        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOTP);

        //validate OTP
        if(recentOTP.length === 0){
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not valid",
            })
        }else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        //create entry in db

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about: null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //resturn response
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be registered. Please try again",
        });
    }
}

//login
exports.login = async (req, res) =>{
    try{

        //get data from requests body
        const{email, password} = req.body;

        //validation of data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required. Please try again",
            });
        }

        //check if user exists
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                meesage:"User is not registered. Please signUp first",
            });
        }

        //generate jwt, after matching password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24hr",
            });
            // Save token to user document in database
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure. pPlease try again",
        });
    }
}

//change passsword
exports.changePassword = async(req, res) => {
    try{
        //get data from req body
        const userDetails = await User.findById(req.user.id);
        //get oldPassworrd, newPassword, confirmNewPassword
        const { oldpassword, newpassword} = req.body;
        //validation
        const isPasswordMatch = await bcrypt.compare(
            oldpassword,
            userDetails.password
        )
        if(!isPasswordMatch){
            //if old password does not match, return a 401 (unauthorized error)
            return res.status(401).json({
                success:false,
                message:"The password is incorrect"
            })
        }

        //update password in DB
        const encryptedPassword = await bcrypt.hash(newpassword, 10);
        const updateedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}
        )
        //send mail - password updated
        try{
            const emailResponse = await mailSender(
                "Password for your account has been updated",
                passwordUpdated(
                updateedUserDetails.email,
                `Password updated successfully for ${updateedUserDetails.firstName} ${updateedUserDetails.lastName}`
            )
            )
            console.log("Email sent successfully:", emailResponse.response);
        }catch(error){
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
            })
        }
        //return response
        return res.json({
            success:true,
            message:"Password updated successfully",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occurred while updating password",
            error: error.message,
        });
    }
}