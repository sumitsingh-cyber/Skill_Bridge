import React from "react"
import { useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"

const Course_Card = ({ course, Height = "h-[350px]" }) => {
  const navigate = useNavigate()

  if (!course || !course._id) {
    console.log("❌ Invalid course:", course)
    return null
  }

  const {
    _id,
    courseName = "Untitled Course",
    thumbnail = "https://via.placeholder.com/400x250?text=No+Image",
    price = 0,
    ratingAndReviews = [],
    studentsEnrolled = [],
  } = course

  const avgRating =
    ratingAndReviews.length > 0
      ? (
          ratingAndReviews.reduce(
            (acc, cur) => acc + (Number(cur?.rating) || 0),
            0
          ) / ratingAndReviews.length
        ).toFixed(1)
      : "0.0"

  return (
    <div
      onClick={() => navigate(`/courses/${_id}`)}
      className={`
        ${Height}
        cursor-pointer
        rounded-xl
        overflow-hidden
        bg-gray-800
        transition-all
        duration-300
        hover:scale-[1.03]
        hover:shadow-[0_0_25px_rgba(255,214,10,0.35)]
        flex
        flex-col
      `}
    >
      {/* IMAGE */}
      <img
        src={thumbnail}
        alt={courseName}
        loading="lazy"
        className="h-44 w-full object-cover bg-gray-700"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/400x250?text=No+Image"
        }}
      />

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-lg font-semibold text-gray-50 line-clamp-2">
          {courseName}
        </p>

        <div className="flex items-center gap-2 text-sm text-yellow-100">
          <span>{avgRating}</span>
          <FaStar />
          <span className="text-gray-300">
            ({ratingAndReviews.length})
          </span>
        </div>

        <p className="text-sm text-gray-300">
          {studentsEnrolled.length} students
        </p>

        <div className="mt-auto">
          <p className="text-lg font-bold text-gray-50">
            ₹ {price}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Course_Card
