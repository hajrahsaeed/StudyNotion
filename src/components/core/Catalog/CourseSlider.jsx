import React from 'react'
import CourseCard from './CourseCard'
import {Swiper, SwiperSlide} from "swiper/react"
import { Autoplay, FreeMode, Pagination } from 'swiper';
import 'swiper/css';  // Import basic Swiper styles
import 'swiper/css/free-mode'; 
import 'swiper/css/pagination';


const CourseSlider = ({Courses}) => {
  return (
    <div>
      <>
        {Courses?.length ? (
          <Swiper 
             slidesPerView={1}
             spaceBetween={25}
             loop={true}
             modules={[FreeMode, Pagination, Autoplay]}
             autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
             breakpoints={{
              1024:{
                slidesPerView:3,
              },
             }}
             className='max-h-[30rem]'
          >
            {Courses.map((course, i) => (
              <SwiperSlide key={i}>
                <CourseCard course = {course} height={"h-[250px]"}/>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-xl text-richblack-5">No Course Found</p>
        )}
      </>
    </div>
  )
}

export default CourseSlider
