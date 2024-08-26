const User = require("../models/User");
const mailsender = require("../utils/mailSender");  
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//reset password token
exports.resetPasswordToken = async(req, res) =>{
    try{
        //get email from req body
        const email = req.body.email;
    
        //check user for this email , validation
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({
                success:false,
                message:"Your email is not registered.",
            });
        }
    
        //token generation
        const token = crypto.randomBytes(20).toString("hex");
    
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                           token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                        },
                                        {new:true});
    
        console.log("DETAILS", updatedDetails);                            
        //create  url
        const url = `http://localhost:3000/update-password/${token}`;
        
        //send mail containing the url
        await mailsender(email, 
                        "Password Reset Link",
                        `Password Reset Link: ${url}`
    
        );
        // return reponse
        return res.json({
            success:true,
            message:"Email sent successfully, please recheck email and change again",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messsage:"Something went wrong, while sending resrt passwrod mail",
        });
    }
}

//reset Password
exports. resetPassword = async(req,res) =>{
    try{
        //fetch data
        const {password, confirmPassword, token} = req.body;

        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }

        //get userdetailsfrom db using token
        const userDetails = await User.findOne({token: token});

        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:fasle,
                message:"Token Invalid",
            });
        }

        //token time expires if
        if( userDetails.resetPasswordExpires < Date.now() ) {
            return res.json({
                success:false,
                message:"Token is expired, please regenerate your token",
            });
        }
        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true});

        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfully",
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting",
        });
    }
}