import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {deleteCourse, fetchInstructorCourses} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const TRUNCATE_LENGTH = 30

const handleCourseDelete = async (courseId) => {
  try {
    setLoading(true)

    await deleteCourse(courseId, token)

    const result = await fetchInstructorCourses(token)
    if (result) setCourses(result)

    setConfirmationModal(null)
  } catch (error) {
    console.error("DELETE FAILED:", error?.response?.data || error.message)
  } finally {
    setLoading(false) // ✅ ALWAYS runs
  }
}


  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full border-collapse">
          <thead className="bg-gray-950">
            <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
              <th className="px-6 py-3">Courses</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-lg font-medium text-gray-400"
                >
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-800 transition hover:bg-gray-800/60"
                >
                  {/* Course Info */}
                  <td className="px-6 py-8">
                    <div className="flex gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-24 w-40 rounded-lg object-cover"
                      />

                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold text-gray-100">
                          {course.courseName}
                        </p>

                        <p className="text-sm text-gray-400">
                          {course.courseDescription.split(" ").length >
                          TRUNCATE_LENGTH
                            ? course.courseDescription
                                .split(" ")
                                .slice(0, TRUNCATE_LENGTH)
                                .join(" ") + "..."
                            : course.courseDescription}
                        </p>

                        <p className="text-xs text-gray-500">
                          Created: {formatDate(course.createdAt)}
                        </p>

                        {course.status === COURSE_STATUS.DRAFT ? (
                          <span className="flex w-fit items-center gap-2 rounded-full bg-gray-700 px-3 py-1 text-xs text-pink-300">
                            <HiClock size={14} />
                            Draft
                          </span>
                        ) : (
                          <span className="flex w-fit items-center gap-2 rounded-full bg-gray-700 px-3 py-1 text-xs text-yellow-300">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-300 text-gray-900">
                              <FaCheck size={10} />
                            </span>
                            Published
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-8 text-sm text-gray-200">
                    2hr 30min
                  </td>

                  <td className="px-6 py-8 text-sm font-semibold text-gray-100">
                    ₹{course.price}
                  </td>

                  <td className="px-6 py-8">
                    <div className="flex gap-2">
                      <button
                        disabled={loading}
                        onClick={() =>
                          navigate(`/dashboard/edit-course/${course._id}`)
                        }
                        className="rounded-md p-2 hover:bg-gray-700 hover:text-yellow-300"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      <button
                        disabled={loading}
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this course?",
                            text2:
                              "All data related to this course will be permanently deleted.",
                            btn1Text: loading ? "Deleting..." : "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              !loading && handleCourseDelete(course._id),
                            btn2Handler: () =>
                              !loading && setConfirmationModal(null),
                          })
                        }
                        className="rounded-md p-2 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
