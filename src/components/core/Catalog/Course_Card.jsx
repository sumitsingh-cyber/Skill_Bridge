import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { HiOutlineUsers } from "react-icons/hi"
import { FiArrowUpRight } from "react-icons/fi"

import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews || [])
    setAvgReviewCount(count)
  }, [course])

  if (!course || !course._id) {
    return null
  }

  const instructorName = course.instructor
    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
    : "SkillBridge Instructor"

  const instructorImage = course.instructor?.image
    ? course.instructor.image.replace(/^http:\/\//, "https://")
    : null

  const thumbnailSrc = !imgError && course.thumbnail
    ? course.thumbnail.replace(/^http:\/\//, "https://")
    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"

  const enrolledCount = Array.isArray(course.studentsEnrolled)
    ? course.studentsEnrolled.length
    : (typeof course.studentsEnrolled === "number" ? course.studentsEnrolled : 0)

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group block h-full select-none"
    >
      <div
        className="
          relative flex h-full flex-col overflow-hidden rounded-2xl
          bg-richblack-800/90 border border-richblack-700/60
          shadow-lg shadow-black/20
          transition-all duration-300 ease-out
          hover:-translate-y-1.5 hover:border-yellow-100/40
          hover:shadow-[0_14px_36px_rgba(255,214,10,0.12)]
        "
      >
        {/* Glow highlight */}
        <div
          className="
            pointer-events-none absolute -inset-px rounded-2xl opacity-0
            transition-opacity duration-300 group-hover:opacity-100
            bg-linear-to-b from-yellow-50/10 via-transparent to-transparent
          "
        />

        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-richblack-900">
          <img
            src={thumbnailSrc}
            alt={course.courseName}
            onError={() => setImgError(true)}
            className="
              h-full w-full object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-105
            "
          />
          <div className="absolute inset-0 bg-linear-to-t from-richblack-900/80 via-transparent to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            {enrolledCount > 10 ? (
              <span className="rounded-full bg-yellow-50/90 px-2.5 py-0.5 text-[11px] font-bold text-richblack-900 shadow-md">
                Bestseller
              </span>
            ) : (
              <span className="rounded-full bg-richblack-800/80 backdrop-blur-md border border-richblack-600 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-50">
                Popular
              </span>
            )}
          </div>

          {/* Arrow Icon on Hover */}
          <div
            className="
              absolute top-3 right-3 flex h-8 w-8 items-center justify-center
              rounded-full bg-richblack-900/80 backdrop-blur-md text-richblack-100
              opacity-0 transition-all duration-300 group-hover:opacity-100
              group-hover:scale-105 group-hover:bg-yellow-50 group-hover:text-richblack-900
            "
          >
            <FiArrowUpRight size={16} />
          </div>
        </div>

        {/* Course Body */}
        <div className="flex flex-1 flex-col justify-between p-4 gap-3">
          {/* Title & Instructor */}
          <div className="flex flex-col gap-2">
            <h3
              className="
                text-base font-bold text-richblack-5 leading-snug
                line-clamp-2 min-h-[2.75rem]
                transition-colors duration-200 group-hover:text-yellow-50
              "
              title={course.courseName}
            >
              {course.courseName}
            </h3>

            {/* Instructor Info */}
            <div className="flex items-center gap-2">
              {instructorImage ? (
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="h-6 w-6 rounded-full object-cover border border-richblack-600"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-richblack-700 text-[10px] font-bold text-yellow-50 flex items-center justify-center border border-richblack-600">
                  {instructorName.charAt(0) || "I"}
                </div>
              )}
              <span className="text-xs font-medium text-richblack-300 truncate max-w-[180px]">
                {instructorName}
              </span>
            </div>
          </div>

          {/* Rating & Students Enrolled */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-yellow-100 text-sm">
              {avgReviewCount > 0 ? avgReviewCount.toFixed(1) : "4.5"}
            </span>
            <RatingStars
              Review_Count={avgReviewCount > 0 ? avgReviewCount : 4.5}
              Star_Size={14}
            />
            <span className="text-richblack-400">
              ({course.ratingAndReviews?.length || 0})
            </span>

            {enrolledCount > 0 && (
              <span className="ml-auto flex items-center gap-1 text-[11px] text-richblack-400">
                <HiOutlineUsers size={12} />
                {enrolledCount}
              </span>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between border-t border-richblack-700/60 pt-3 mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-richblack-5">
                ₹{course.price?.toLocaleString?.("en-IN") || course.price}
              </span>
              {course.price > 0 && (
                <span className="text-xs text-richblack-400 line-through">
                  ₹{Math.round(course.price * 1.5)?.toLocaleString?.("en-IN")}
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-yellow-50 group-hover:underline">
              Explore Course →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Course_Card
