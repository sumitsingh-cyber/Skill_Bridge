import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"

import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"

function CourseDetails() {
  const { user, loading } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { paymentLoading } = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [courseDetails, setCourseDetails] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [isActive, setIsActive] = useState([])

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchCourseDetails(courseId)
      if (res?.success) setCourseDetails(res.data)
    }
    fetchData()
  }, [courseId])

  // ================= AVG RATING =================
  useEffect(() => {
    if (courseDetails?.ratingAndReviews) {
      setAvgReviewCount(GetAvgRating(courseDetails.ratingAndReviews))
    }
  }, [courseDetails])

  // ================= LOADING =================
  if (loading || paymentLoading || !courseDetails) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-900">
        <div className="spinner"></div>
      </div>
    )
  }

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent = [],
    ratingAndReviews = [],
    instructor,
    studentsEnrolled = [],
    createdAt,
  } = courseDetails

  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // ================= BUY COURSE (FIXED) =================
  const handleBuyCourse = () => {
    console.log("🟡 Buy Now clicked")
    console.log("🟡 Token:", token)
    console.log("🟡 Course ID:", courseId)

    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase this course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      })
      return
    }

    // ✅ CRITICAL FIX — prevent 401
    if (user?.accountType !== "Student") {
      setConfirmationModal({
        text1: "Only students can buy courses",
        text2: "Please login with a student account.",
        btn1Text: "OK",
        btn2Text: "Cancel",
        btn1Handler: () => setConfirmationModal(null),
        btn2Handler: () => setConfirmationModal(null),
      })
      return
    }

buyCourse(token, [courseId], user, navigate, dispatch)

 

  }

  return (
    <>
      <main className="bg-gray-900 text-white">

        {/* ================= HERO ================= */}
        <section className="bg-linear-to-b from-gray-800 to-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-5">
              <h1 className="text-4xl font-bold leading-tight">
                {courseName}
              </h1>

              <p className="text-gray-300 text-lg">
                {courseDescription}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-semibold">
                  {avgReviewCount}
                </span>
                <RatingStars Review_Count={avgReviewCount} />
                <span className="text-sm text-gray-400">
                  ({ratingAndReviews.length} reviews)
                </span>
                <span className="text-sm text-gray-400">
                  {studentsEnrolled.length} students
                </span>
              </div>

              <p className="text-sm">
                Created by{" "}
                <span className="font-medium text-gray-200">
                  {instructor?.firstName} {instructor?.lastName}
                </span>
              </p>

              <div className="flex gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <BiInfoCircle /> {formatDate(createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </span>
              </div>

              {/* ✅ BUY BUTTON — ALL SCREENS */}
              <div className="pt-6">
                <button
                  onClick={handleBuyCourse}
                  className="
                    w-44
                    bg-yellow-400
                    text-black
                    font-semibold
                    py-3
                    rounded-lg
                    transition-all
                    hover:scale-[1.03]
                    hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]
                  "
                >
                  Buy Now ₹{price}
                </button>
              </div>
            </div>

            {/* RIGHT CARD (DESKTOP) */}
            <div className="hidden lg:block sticky top-24">
              <CourseDetailsCard
                course={courseDetails}
                handleBuyCourse={handleBuyCourse}
                setConfirmationModal={setConfirmationModal}
              />
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="mx-auto max-w-7xl px-6 py-14 space-y-12">
          <div className="border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              What you'll learn
            </h2>
            {whatYouWillLearn ? (
              <div className="text-gray-300 whitespace-pre-line leading-7">
                {whatYouWillLearn}
              </div>
            ) : (
              <p className="text-gray-500">
                No learning outcomes provided.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Course Content
            </h2>

            {courseContent.length > 0 ? (
              <div className="space-y-4">
                {courseContent.map((course, index) => (
                  <CourseAccordionBar
                    key={index}
                    course={course}
                    isActive={isActive}
                    handleActive={handleActive}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No course content available.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}

export default CourseDetails
