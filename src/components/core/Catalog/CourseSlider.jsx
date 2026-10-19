import React, { useRef } from "react"
import { FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi"
import Course_Card from "./Course_Card"

const CourseSlider = ({ Courses }) => {
  const sliderRef = useRef(null)

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: "smooth" })
    }
  }

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: "smooth" })
    }
  }

  if (!Array.isArray(Courses) || Courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-richblack-700 bg-richblack-800/40 py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-richblack-700 text-richblack-300 mb-3">
          <FiInbox size={22} />
        </div>
        <p className="text-base font-medium text-richblack-200">No courses available yet in this section</p>
        <p className="text-xs text-richblack-400 mt-1">Check back soon or explore other popular categories!</p>
      </div>
    )
  }

  return (
    <div className="relative group/slider">
      {/* Scroll Controls (visible on larger screens or when content overflows) */}
      {Courses.length > 2 && (
        <>
          <button
            onClick={slideLeft}
            aria-label="Scroll left"
            className="
              absolute -left-3 top-1/2 -translate-y-1/2 z-20
              hidden md:flex h-10 w-10 items-center justify-center
              rounded-full bg-richblack-800/90 text-richblack-100 border border-richblack-600
              shadow-xl backdrop-blur-md transition-all duration-200
              hover:bg-yellow-50 hover:text-richblack-900 hover:scale-110 active:scale-95
              opacity-0 group-hover/slider:opacity-100
            "
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={slideRight}
            aria-label="Scroll right"
            className="
              absolute -right-3 top-1/2 -translate-y-1/2 z-20
              hidden md:flex h-10 w-10 items-center justify-center
              rounded-full bg-richblack-800/90 text-richblack-100 border border-richblack-600
              shadow-xl backdrop-blur-md transition-all duration-200
              hover:bg-yellow-50 hover:text-richblack-900 hover:scale-110 active:scale-95
              opacity-0 group-hover/slider:opacity-100
            "
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slider track */}
      <div
        ref={sliderRef}
        className="
          flex gap-5 overflow-x-auto pb-4 pt-1
          scroll-smooth no-scrollbar
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {Courses.map((course) => (
          <div
            key={course._id}
            className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0"
          >
            <Course_Card course={course} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseSlider
