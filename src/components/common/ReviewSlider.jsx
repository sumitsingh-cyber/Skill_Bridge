import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { FaStar } from "react-icons/fa"

import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data.data)
      }
    })()
  }, [])

  if (!reviews.length) {
    return <p className="text-richblack-300">No Reviews</p>
  }

  return (
    <div className="text-white">
      <div className="my-12.5 max-w-maxContentTab lg:max-w-maxContent overflow-x-auto">
        <div className="flex gap-6 pb-4">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="min-w-75 shrink-0 bg-richblack-800 p-4 rounded-xl"
            >
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={
                    review?.user?.image
                      ? review.user.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold text-richblack-5">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </h1>
                  <h2 className="text-xs text-richblack-400">
                    {review?.course?.courseName}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-richblack-25">
                {review.review.split(" ").length > truncateWords
                  ? `${review.review
                      .split(" ")
                      .slice(0, truncateWords)
                      .join(" ")} ...`
                  : review.review}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-yellow-100">
                  {review.rating.toFixed(1)}
                </span>
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewSlider
