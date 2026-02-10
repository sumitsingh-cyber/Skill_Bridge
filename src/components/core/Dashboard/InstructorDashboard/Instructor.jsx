import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import InstructorChart from "./InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const dashboardRes = await getInstructorData(token)
      const coursesRes = await fetchInstructorCourses(token)

      if (dashboardRes?.data) {
        setDashboardData(dashboardRes.data)
      }

      if (Array.isArray(coursesRes)) {
        setCourses(coursesRes)
      }

      setLoading(false)
    }

    fetchData()
  }, [token])

  const totalStudents = courses.reduce(
    (acc, course) => acc + (course.studentsEnrolled?.length || 0),
    0
  )

  const totalAmount = courses.reduce(
    (acc, course) =>
      acc + (course.studentsEnrolled?.length || 0) * course.price,
    0
  )

  if (loading) return <div className="spinner"></div>

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">
          Hi {user?.firstName} 👋
        </h1>
        <p className="mt-1 text-gray-400">
          Let’s start something new
        </p>
      </div>

      {courses.length > 0 ? (
        <>
          {/* ===== Chart + Stats ===== */}
          <div className="flex h-112.5 gap-6">
            <div className="flex-1 rounded-xl bg-gray-900 p-6">
              <InstructorChart courses={courses} />
            </div>

            <div className="min-w-65 rounded-xl bg-gray-900 p-6">
              <p className="text-lg font-semibold text-gray-100">Statistics</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-gray-400">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-100">
                    {courses.length}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Total Students</p>
                  <p className="text-3xl font-bold text-gray-100">
                    {totalStudents}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Total Income</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    ₹ {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Courses Preview ===== */}
          <div className="rounded-xl bg-gray-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-100">
                Your Courses
              </p>
              <Link
                to="/dashboard/my-courses"
                className="text-sm font-semibold text-yellow-400 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="mt-6 flex gap-6">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="w-1/3 rounded-lg bg-gray-800 p-3"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-50 w-full rounded-md object-cover"
                  />

                  <div className="mt-3">
                    <p className="font-medium text-gray-100">
                      {course.courseName}
                    </p>

                    <div className="mt-1 flex gap-2 text-sm text-gray-400">
                      <span>
                        {course.studentsEnrolled?.length || 0} students
                      </span>
                      <span>•</span>
                      <span>₹ {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-24 rounded-xl bg-gray-900 py-20 text-center">
          <p className="text-2xl font-bold text-gray-100">
            You have not created any courses yet
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-3 inline-block text-lg font-semibold text-yellow-400 hover:underline"
          >
            Create a course
          </Link>
        </div>
      )}
    </div>
  )
}
