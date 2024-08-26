const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require('mongoose');


//create rating
exports.createRating = async(req,res) =>{
    try{

        //get user id
        const userId = req.user.id;

        //fetch data from req body
        const {rating,review,courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id:courseId,
            studentsEnrolled: {$elemMatch:{$eq:userId}}
        });
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Studet is not enrolled in the course",
            });
        }
        //check if user already has reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });

        if(alreadyReviewed){
            return res.status(404).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });

        //update course with this rating review
        const updateCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId}, //also can be courseId without curly braces
            {
                $push:{
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new:true}
        );

        console.log(updateCourseDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully",
            ratingReview,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

//get avg rating
exports.getAvgRating = async(req,res) => {
    try{
        //get courseId
        const courseId = req.body.courseId;

        //calculate avg rating

        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    avgRating:{$avg: "$rating"},
                }
            }
        ])

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                avgRating: result[0].avgRating,
            })
        }
        //if not rating review exist
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings till now",
        })
        //return response
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//get all ratings and reviews
exports.getAllRatings = async(req,res) => {
    try{

        const allReviews = await RatingAndReview.find({}).sort({rting:"desc"}).populate(
            {
                path:"user",
                select:"firstName lastName email image",
            }
        )
        .populate(
            {
                path:"course",
                select:"courseName",
            }
        )
        .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}