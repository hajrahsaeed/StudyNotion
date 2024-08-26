const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/subSection");

exports.createSection = async (req,res) => {
    try{
        //data fetch
        const{sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                succes:false,
                message:"Missing fields",
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ).populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            },
        }).exec();//how to use populate to replace section and sub section
        //return reponse
        return res.status(200).json({
            success:true,
            message:"Course Updated",
            updatedCourseDetails,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Section Creation Failed",
            error:error.message,
        });
    }
}

exports.updateSection = async (req, res) =>{
    try{

        //data fetching
        const {sectionName, sectionId, courseId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                succes:false,
                message:"Missing fields",
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},{new:true}
        );

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();
        //return response
        return res.status(200).json({
            success:true,
            message:section,
            data:course,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Section Updated Failed",
            error:error.message,
        });
    }
}

exports.deleteSection = async (req, res) =>{
    try{

        //get ID - assuming that we are sending id in Params
        const {sectionId, courseId} = req.body;

        await Course.findByIdAndUpdate(courseId,
            {$pull:{
                courseContent:sectionId
            }},
        )

        //use findbyIdandDleete
        const sectionDetails = await Section.findById(sectionId);
        console.log(sectionId, courseId);
        if (!sectionDetails) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        //TODO [in testing]: do we need to delete the entry from the course schema
        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: sectionDetails.subSection } })

        await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
       const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        }
      })
      .exec()

        //return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
            data: course,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        });
    }
}