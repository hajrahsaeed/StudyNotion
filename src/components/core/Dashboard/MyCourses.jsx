import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetails";
import { useEffect } from "react";
import IconButton from "../../common/IconButton";
import CourseTable from "./InstructorCourses/CourseTable";
import { useState } from "react";
import { VscAdd } from "react-icons/vsc"

export default function MyCourses(){
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    },[])

    return(
        <div className="text-white">
            <div className="flex justify-between mb-4">
                <h1>My Courses</h1>
                <IconButton
                   text={"Add Course"}
                   onClick={() => navigate("/dashboard/add-course")}
                   //TODO Add Icon

                >
                    <VscAdd/>
                </IconButton>
            </div>

            {courses && <CourseTable courses={courses} setCourses={setCourses}/>}

        </div>
    )
}