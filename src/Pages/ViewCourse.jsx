import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetailsOfCourse } from '../services/operations/courseDetails';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice"
import VideoDetailsSideBar from "../components/core/ViewCourse/VideoDetailsSidesBar"
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {

    const [reviewModel, setReviewModel] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    
    useEffect(() => {
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            console.log("CourseData->", courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completeVideos));
            console.log("Dispatched Course Section Data:", courseData.courseDetails.courseContent);

            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((Sec) => {
                lectures += Sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures));
        }

        setCourseSpecificDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


  return (
    <>
       <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSideBar setReviewModel={setReviewModel}/>
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                    <Outlet/>
                </div>
                
            </div>
            {reviewModel && <CourseReviewModal setReviewModel={setReviewModel}/>}
       </div>
    </>
  )
}

export default ViewCourse
