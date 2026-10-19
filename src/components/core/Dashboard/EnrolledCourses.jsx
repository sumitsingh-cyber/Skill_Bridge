import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const getEnrolledCourses = async () => {
    try {
      setLoading(true)
      const currentToken = token || localStorage.getItem("token")?.replace(/^["']|["']$/g, "")
      if (!currentToken) {
        setEnrolledCourses([])
        return
      }
      const res = await getUserEnrolledCourses(currentToken)
      setEnrolledCourses(Array.isArray(res) ? res : [])
    } catch (error) {
      console.log("❌ Could not fetch enrolled courses.", error)
      setEnrolledCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEnrolledCourses()
  }, [token])

  /* ✅ SINGLE CLICK HANDLER */
  const handleCourseClick = (course) => {
    navigate(`/view-course/${course._id}`)
  }

  return (
    <>
      <div className="mb-6 text-3xl font-semibold text-gray-100">
        Enrolled Courses
      </div>

      {loading ? (
        <div className="grid min-h-50 place-items-center">
          <div className="spinner"></div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 py-16 text-center">
          <p className="text-xl font-medium text-gray-200">
            You have not enrolled in any courses yet.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Explore our diverse catalog of skill-building courses and start your journey!
          </p>
          <button
            onClick={() => navigate("/catalog/web-development")}
            className="mt-5 rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-300 transition-all shadow-md shadow-yellow-500/20 active:scale-95"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden sm:flex rounded-xl bg-gray-800/80 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 border border-gray-700/60">
            <p className="w-[50%]">Course</p>
            <p className="w-[25%]">Duration</p>
            <p className="w-[25%] text-right pr-4">Progress</p>
          </div>

          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-800
                         bg-gray-900/80 p-4 sm:p-5 shadow-lg backdrop-blur-md
                         transition-all duration-300 ease-in-out
                         hover:border-gray-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              {/* Course Info */}
              <div
                className="flex sm:w-[50%] cursor-pointer items-center gap-4"
                onClick={() => handleCourseClick(course)}
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-16 w-24 sm:h-14 sm:w-20 rounded-xl object-cover shrink-0 border border-gray-700"
                />

                <div className="flex flex-col gap-1 min-w-0">
                  <p className="font-semibold text-gray-100 line-clamp-1 hover:text-yellow-400 transition-colors">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {course.courseDescription || "Start learning right now."}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="mt-3 sm:mt-0 sm:w-[25%] text-xs text-gray-400 sm:px-4">
                <span className="sm:hidden font-medium text-gray-300">Duration: </span>
                {course.totalDuration || "Self-Paced"}
              </div>

              {/* Progress & CTA */}
              <div className="mt-3 sm:mt-0 sm:w-[25%] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-bold text-yellow-400">
                    {course.progressPercentage ?? 0}%
                  </span>
                </div>

                <ProgressBar
                  completed={course.progressPercentage ?? 0}
                  height="7px"
                  isLabelVisible={false}
                  bgColor="#FACC15"
                  baseBgColor="#374151"
                />

                <button
                  onClick={() => handleCourseClick(course)}
                  className="mt-1 w-full rounded-lg bg-gray-800 py-1.5 text-xs font-semibold text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400 hover:text-gray-900 transition-all active:scale-95 text-center"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

