import { useEffect, useState } from "react"
import {
  FiBookOpen,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
} from "react-icons/fi"
import { Link } from "react-router-dom"
import {
  getAllPlatformCourses,
  updatePlatformCourseStatus,
} from "../../../../services/operations/adminAPI"

export default function AllCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchCourses = async () => {
    setLoading(true)
    const result = await getAllPlatformCourses()
    if (result) {
      setCourses(result)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleToggleStatus = async (courseId, currentStatus) => {
    const nextStatus = currentStatus === "Published" ? "Draft" : "Published"
    const success = await updatePlatformCourseStatus(courseId, nextStatus)
    if (success) {
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, status: nextStatus } : c
        )
      )
    }
  }

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      (c.courseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.instructor?.firstName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" && c.status === "Published") ||
      (statusFilter === "Draft" && c.status !== "Published")
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">All Platform Courses</h1>
          <p className="mt-1 text-sm text-gray-400">
            Monitor, inspect, and toggle publication status of courses across all instructors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Published", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                statusFilter === status
                  ? "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        <input
          type="text"
          placeholder="Search by course title or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900/90 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 backdrop-blur-md focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="grid min-h-60 place-items-center">
          <div className="spinner"></div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 py-16 text-center">
          <FiBookOpen className="mx-auto text-4xl text-gray-600" />
          <p className="mt-3 text-lg font-medium text-gray-300">No courses found</p>
          <p className="text-sm text-gray-500">No courses match your filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/80 shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-950/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-normal">
              {filteredCourses.map((c) => {
                const isPublished = c.status === "Published"

                return (
                  <tr
                    key={c._id}
                    className="transition-colors hover:bg-gray-800/30"
                  >
                    {/* Course */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            c.thumbnail ||
                            "https://via.placeholder.com/150?text=Course"
                          }
                          alt={c.courseName}
                          className="h-12 w-20 rounded-lg object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-100 line-clamp-1">
                            {c.courseName}
                          </p>
                          <Link
                            to={`/courses/${c._id}`}
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-0.5"
                          >
                            <span>Preview</span>
                            <FiExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <p className="font-medium text-gray-200">
                        {c.instructor
                          ? `${c.instructor.firstName} ${c.instructor.lastName}`
                          : "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {c.instructor?.email}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <span className="rounded-md bg-gray-800 px-2 py-1 border border-gray-700">
                        {c.category?.name || "General"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-yellow-400">
                      ₹ {c.price}
                    </td>

                    {/* Students */}
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {c.studentsEnrolled?.length || 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isPublished
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {isPublished ? (
                          <FiCheckCircle className="text-xs text-emerald-400" />
                        ) : (
                          <FiClock className="text-xs text-gray-400" />
                        )}
                        <span>{c.status || "Draft"}</span>
                      </span>
                    </td>

                    {/* Action Toggle */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c._id, c.status)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                          isPublished
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        }`}
                      >
                        {isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
