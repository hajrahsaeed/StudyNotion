import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilderForm/CourseBuilderForm"
import CourseInformationForm from "./CourseInformationForm/CourseInformationForm"
import PublishCourse from "./PublishForm/Publish"

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <div>
      <div className="relative mb-2 flex w-full justify-center " >
        {steps.map((item) => (
           <div key={item.id} 
           className="flex items-center">
              <button className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px]
                 ${step === item.id 
                  ? "border-yellow-50 bg-yellow-900 text-yellow-50" 
                 : "border-richblack-700 bg-richblack-800 text-richblack-300"} 
                 ${step > item.id && "bg-yellow-50 text-yellow-50"}} `}
              >
                 {step > item.id ? (
                 <FaCheck className="font-bold text-richblack-900" /> 
                 ):(
                 item.id)}
              </button>
              
              {item.id !== steps.length && (
              <div className={`h-0.5 w-48 border-dashed border-b-2 
                ${step > item.id ? "border-yellow-50" 
                : "border-richblack-500"} `}>
              </div>
              )}
            </div>
          ))}
        </div>

      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div key={item.id} className="flex min-w-[130px] flex-col items-center gap-y-2">
            <p className={`text-sm ${step >= item.id ? "text-richblack-5" : "text-richblack-500"}`}>{item.title}</p>
          </div>
        ))}
      </div>


      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </div>
  )
}
