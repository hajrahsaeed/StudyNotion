import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_ith_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lessosn from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../../../components/core/HomePage/Button"

const LearninglanguageSection = () => {
  return (
    <div className='mt-36 mb-16'>
      <div className='flex flex-col gap-5 items-center'>
        <div className='text-4xl font-semibold text-center'>
            Your Swiff Knife for 
            <HighlightText text={"learning and lagnuage"}/>
        </div>

        <div className='text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0'>
            <img src={know_your_progress} alt="KnowYourProgress"  className='abject-contain lg:-mr-32' />
            <img src={compare_ith_others} alt="CompareWithOthers" className='object-contain lg:-mb-10 lg:-mt-0 -mt-12'/>
            <img src={plan_your_lessosn} alt="PlanYourLessons" className='object-contain  lg:-ml-36 lg:-mt-5 -mt-16'/>
        </div>

        <div className='w-fit mx-auto lg:mb-20 mb-8 -mt-5'>
            <CTAButton active={true} linkto={"/signup"} border={false}>
               Learn more
            </CTAButton>
        </div>

      </div>
    </div>
  )
}

export default LearninglanguageSection
