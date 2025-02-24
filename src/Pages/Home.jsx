import React from 'react';
import { Link } from "react-router-dom";
import {FaArrowRight} from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlock';
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearninglanguageSection from "../components/core/HomePage/LearninglanguageSection"
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Exploremore from '../components/core/HomePage/Exploremore';
import Footer from "../components/common/Footer";
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  return (
    <div className=''>
      {/* Section 1 */}
      <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white '>

        <Link to={"/signup"}>  {/* to signup API route */}
            <div className='group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none"'>    
                <div className='flex flex-row items-center gap-2 
                rounded-full px-10 py-[5px] transition-all 
                duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
            </div>
        </Link>

        <div className='mt-3 text-center text-4xl font-semibold'>
          Empower Your Future with 
          <HighlightText text = {"Coding Skills"}/>
        </div>

        <div className='-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300 '>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedbacks from instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>
          <CTAButton active={true} linkto = {"/signup"} border={false}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto = {"/login"} border={true}> 
            Book a Demo
          </CTAButton>
        </div>

        <div className='mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
          <video
          muted 
          loop
          autoPlay className='shadow-[20px_20px_rgba(255,255,255)] '> 
          {/* shadow-[1px_20px_20px_10px_#00000024] */}

            <source src={Banner} type='video/mp4' />
           
          </video>

        </div>

        {/* Code section 1 */}
        <div>
          <CodeBlocks 
          position={"lg:flex-row"}
          heading = {
            <div className='text-4xl font-semibold'>
              Unlock Your 
              <HighlightText text={"coding potential "}
              />with our online courses
            </div>
          } 

          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"
          }

          ctabtn1={
            {
              btnText : "try it yourself",
              linkto : "/signup",
              active:true,
              border:false,
            }
          }

          ctabtn2={
            {
              btnText : "learn more",
              linkto : "/login",
              active:false,
              border:true,
            }
          }

          codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
          codeColor={"text-yellow-25"}
          backgroundGradient={<div className="codeblock1 absolute"></div>}
          >

          </CodeBlocks>
        </div>
      
      {/* Code section 2 */}
      <div>
        <CodeBlocks 
          position={"lg:flex-row-reverse"}
          heading = {
            <div className='w-[100%] text-4xl font-semibold lg:w-[50%]'>
              Start
              <HighlightText text={"coding in seconds"}
              />
            </div>
          } 

          subheading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }

          ctabtn1={
            {
              btnText : "Continue Lesson",
              linkto : "/signup",
              active:true,
              border:false,
            }
          }

          ctabtn2={
            {
              btnText : "learn more",
              linkto : "/login",
              active:false,
              border:true,
            }
          }

          codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
          codeColor={"text-white"}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
          >

        </CodeBlocks>
        </div>

        <Exploremore/>

      </div>

      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepage_bg h-[320px]'>

          <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-8 mx-auto'>
            <div className='lg:h-[150px]'></div>
            <div className='flex flex-row gap-7 text-white lg:mt-8'>
              <CTAButton active={true} linkto={"/signup"} border={false}>
                <div className='flex items-center gap-3'>
                  Explore Full Catalog
                  <FaArrowRight></FaArrowRight>
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"} border={true}>
                <div className='flex gap-x-2 items-center justify-center'>
                  Learn More
                  <FaArrowRight></FaArrowRight>
                </div>
              </CTAButton>
            </div>
          </div>


        </div>

        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col  items-center justify-between gap-8'>

          
          <div className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'>
            <div className='text-4xl font-semibold lg:w-[45%]'>
              Get the Skills you need for a 
              <HighlightText text={"Job that is in demand"}/>
            </div>

            <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
              <div className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>
              <CTAButton active={true} linkto={"/signup"} border={false}>
                <div className=''>
                  Learn More
                </div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection/>

          <LearninglanguageSection/>

        </div>

      </div>

      {/* Section 3 */}
      <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
        <InstructorSection/>

        <h2 className='text-center text-4xl font-semibold mt-8'>Reviews from other learners</h2>
        {/* Review Slider here */}
        
          <ReviewSlider />

      </div>

      {/* Footer */}
      <Footer/>


    </div>
  )
}

export default Home

//  home work
//  1 add shadow in section 1
// shadow on buttons, border
//shadow on video
