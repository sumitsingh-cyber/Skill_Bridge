import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews || [])
    setAvgReviewCount(count)
  }, [course])

  // ❌ If course OR course._id is missing, do not render clickable card
  if (!course || !course._id) {
    console.error("❌ CourseCard: Missing course or course._id", course)
    return null
  }

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group block"
    >
      <div
        className="
          relative rounded-xl bg-gray-800
          transition-all duration-300 ease-out
          hover:scale-[1.03]
          hover:shadow-[0_0_30px_rgba(180,180,180,0.25)]
        "
      >
        {/* Glow overlay */}
        <div
          className="
            pointer-events-none absolute inset-0 rounded-xl
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            bg-linear-to-br from-gray-300/20 via-transparent to-gray-500/20
          "
        />

        {/* Course Image */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className={`
              ${Height}
              w-full object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-110
            `}
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-2 px-3 py-4">
          <p
            className="
              text-xl font-semibold text-gray-100
              transition-colors duration-300
              group-hover:text-gray-200
            "
          >
            {course.courseName}
          </p>

          <p className="text-sm text-gray-400">
            {course.instructor?.firstName} {course.instructor?.lastName}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-gray-200 font-medium">
              {avgReviewCount || 0}
            </span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-gray-500 text-sm">
              ({course.ratingAndReviews?.length || 0} Ratings)
            </span>
          </div>

          <p
            className="
              mt-1 text-xl font-bold text-gray-100
              transition-all duration-300
              group-hover:text-gray-50
              group-hover:drop-shadow-[0_0_10px_rgba(200,200,200,0.6)]
            "
          >
            ₹ {course.price}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default Course_Card
