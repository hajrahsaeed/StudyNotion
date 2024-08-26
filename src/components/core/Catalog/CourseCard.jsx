import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRatings";

const CourseCard = ({course, height}) => {

    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=>{
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])

    console.log("Course Data: ", course);

  return (
    <div>
      <Link to={`/courses/${course._id}`}>
            <div>
                <div className="rounded-lg">
                    <img src={course?.thumbnail} alt="course thumbnail" className={`${height} w-full rounded-xl object-cover`} />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">{avgReviewCount || 0}</span>
                        <RatingStars Review_count={avgReviewCount}/>
                        <span>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-richblack-5">{course?.price}</p>
                </div>
            </div>
      </Link>
    </div>
  )
}

export default CourseCard
