import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"

import { handlePaymentSuccess } from "../../../services/operations/studentsFeatureApi"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrollCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const location = useLocation();
  const dispatch = useDispatch();

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);

        // If courses are duplicated, consider using a Set to avoid duplicates
        const uniqueCourses = [...new Set(res.map(course => course._id))]
            .map(id => res.find(course => course._id === id));
        // const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        setEnrolledCourses(uniqueCourses);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };


  // Check for session_id in the URL and handle payment success
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      handlePaymentSuccess(sessionId, token, navigate, dispatch);
    } else {
      getEnrolledCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  const sectionId = course.courseContent?.[0];
                  console.log("course.courseContent:", course.courseContent);
                  console.log("sectionId:", sectionId);
                  const subSectionId = course.courseContent?.[0]?.subSection?.[0]?._id;
                  console.log("Fetched section details:", sectionId);
                  if (sectionId && subSectionId) {
                      navigate(`/view-course/${course?._id}/section/${sectionId}/sub-section/${subSectionId}`);
                   } else {
                      console.error("Section or Sub-section ID is missing");
                      // You can also show a user-friendly message here, like a toast notification.
                    }
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}