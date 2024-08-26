import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

import  {createSection, updateSection, } from "../../../../../services/operations/courseDetails"

import { setCourse,setEditCourse, setStep } from "../../../../../slices/courseSlice"

import IconButton from "../../../../common/IconButton"
import NestedView from "./NestedView"

const CourseBuilderForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm()
    
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [editSectionName, setEditSectionName] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("Initial course data:", course);
    }, [course]);
    
    
    const onSubmit = async (data) => {
        console.log("onSubmit called with data:", data); // Check if onSubmit is called
        setLoading(true);
        let result;
      
        try {
          if (editSectionName) {
            console.log("Updating section with ID:", editSectionName);
            result = await updateSection({
              sectionName: data.sectionName,
              sectionId: editSectionName,
              courseId: course._id,
            }, token);
          } else {
            console.log("Creating new section");
            result = await createSection({
              sectionName: data.sectionName,
              courseId: course._id,
            }, token);
          }
      
          console.log("API call result:", result); // Log the result to ensure it contains courseContent
      
          if (result) {
            dispatch(setCourse(result)); // Updates course in Redux state, including courseContent
            setEditSectionName(null);
            setValue("sectionName", "");
          }
           } catch (error) {
               console.error("Error in API call:", error); // Log any errors
            } finally {
                setLoading(false);
        }
    };
      

    const cancelEdit = () => {
        setEditSectionName(null)
        setValue("sectionName", "")
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            cancelEdit()
            return
        }
        setEditSectionName(sectionId)
        setValue("sectionName", sectionName)
    }

    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true))
    }

    const goToNext = () => {
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section")
            return
        }
        if(
            course.courseContent.some((section) => section.subSection.length === 0)
        )
            {
            toast.error("Please add atleast one lecture in each section")
            return
        }
        dispatch(setStep(3))
    }

    return(
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">
                Course Builder
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5"  htmlFor="sectionName">
                        Section Name <sup className="text-pink-200">*</sup>
                    </label>
                    <input 
                        id="sectionName"
                        disabled={loading}
                        placeholder="Add a section to build your course"
                        {...register("sectionName", { required: true })}
                        className="form-style w-full"
                        />
                        {
                            errors.sectionName && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">Section name is required</span>
                            )
                        }
                </div>
                <div className="flex items-end gap-x-4">
                    <IconButton type="submit" 
                      disabled={loading} 
                      text={editSectionName ? "Edit Section Name" : "Create Section"}
                      outline={true}
                    >
                      
                        <IoAddCircleOutline size={20} className="text-yellow-50"/>
                    </IconButton>
                    {editSectionName && (
                        <button 
                          type="button" 
                          onClick={cancelEdit}
                          className="text-sm text-richblack-300 underline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
            {course.courseContent.length >  0 && (
                <NestedView handleChangeEditSectionName = {handleChangeEditSectionName}/>
            )}
            {/* Next Prev Button */}
            <div className="flex justify-end gap-x-3">
                <button
                    onClick={goBack}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                >
                   Back
                </button>
                <IconButton disabled={loading} text="Next" onClick={goToNext}>
                    <MdNavigateNext />
                </IconButton>
            </div>

        </div>
    )

}

export default CourseBuilderForm