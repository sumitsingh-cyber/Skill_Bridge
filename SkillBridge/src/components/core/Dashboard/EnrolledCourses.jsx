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
      const res = await getUserEnrolledCourses(token)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <p className="grid h-[10vh] w-full place-content-center text-gray-400">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex rounded-lg bg-gray-800 text-sm font-medium text-gray-200">
            <p className="w-[45%] px-6 py-4">Course</p>
            <p className="w-1/4 px-4 py-4">Duration</p>
            <p className="flex-1 px-4 py-4">Progress</p>
          </div>

          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="flex items-center rounded-xl border border-gray-700
                         bg-gray-900 shadow-md
                         transition-all duration-300 ease-in-out
                         hover:scale-[1.01] hover:border-gray-500 hover:bg-gray-800"
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-6 py-4"
                onClick={() => handleCourseClick(course)}
              >
                <img
                  src={course.thumbnail}
                  alt="course thumbnail"
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-100">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {course.courseDescription?.slice(0, 50)}...
                  </p>
                </div>
              </div>

              <div className="w-1/4 px-4 py-4 text-sm text-gray-300">
                {course.totalDuration || "—"}
              </div>

              <div className="flex w-1/5 flex-col gap-2 px-4 py-4">
                <p className="text-xs text-gray-300">
                  Progress:{" "}
                  <span className="font-medium text-yellow-400">
                    {course.progressPercentage ?? 0}%
                  </span>
                </p>

                <ProgressBar
                  completed={course.progressPercentage ?? 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#FACC15"
                  baseBgColor="#374151"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
