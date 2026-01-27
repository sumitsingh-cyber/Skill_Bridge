import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"

export default function RenderSteps() {
const { step = 1 } = useSelector((state) => state.course || {})



  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ]

  return (
    <>
      {/* ================= STEPPER ICONS ================= */}
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((item) => (
          <div key={item.id} className="flex w-full items-center">
            <div className="flex flex-col items-center">
              <button
                className={`grid aspect-square w-8.5 place-items-center rounded-full border
                  transition-all duration-300 ease-in-out
                  ${
                    step === item.id
                      ? "border-yellow-400 bg-yellow-900 text-yellow-400 scale-110"
                      : step > item.id
                      ? "border-yellow-400 bg-yellow-400 text-gray-900"
                      : "border-gray-700 bg-gray-800 text-gray-400"
                  }`}
              >
                {step > item.id ? (
                  <FaCheck className="text-sm font-bold" />
                ) : (
                  item.id
                )}
              </button>
            </div>

            {/* Connector Line */}
            {item.id !== steps.length && (
              <div
                className={`h-4.25 w-full border-b-2 border-dashed
                  transition-colors duration-300
                  ${
                    step > item.id
                      ? "border-yellow-400"
                      : "border-gray-600"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ================= STEPPER LABELS ================= */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            key={item.id}
            className="flex min-w-32.5 flex-col items-center gap-y-2"
          >
            <p
              className={`text-sm font-medium transition-colors duration-300
                ${
                  step >= item.id
                    ? "text-gray-100"
                    : "text-gray-500"
                }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* ================= STEP CONTENT ================= */}
      <div className="transition-opacity duration-300 ease-in-out">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </>
  )
}
