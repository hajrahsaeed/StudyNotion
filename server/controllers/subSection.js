const SubSection = require("../models/subSection");
const Section = require("../models/Section");
const {uploadImgToCloudinary} = require("../utils/imgUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) =>{
    try{
        //fetch data
        const {sectionId, title, description} = req.body;
        //extract file/video
        const video = req.files.video;
        //data validation
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are Required",
            });
        }
        console.log(video)
        //upload video to cloudinary
        const uploadDetails = await uploadImgToCloudinary(
            video, process.env.FOLDER_NAME);
        console.log(uploadDetails)
        //create subSection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update in section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push:{
                subSection:SubSectionDetails._id
            }},
            {new:true}
        ).populate('subSection'); // Populate subSections

        // Log updated section after adding populate query
        console.log('Updated Section:', updatedSection);//TODO: log updated sectio here after adding populate query
        //return response
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            data:updatedSection,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"SubSection creation Failed",
            error:error.message,
        });
    }
}

//update subsction and delete subsection Home Work
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.Descryption  = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImgToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )

      console.log("updated section", updatedSection)

  
      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the Subsection",
        error:error.message,
      })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data:updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
}