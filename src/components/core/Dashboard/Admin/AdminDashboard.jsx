import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  FiUsers,
  FiBookOpen,
  FiDollarSign,
  FiLayers,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiFolder,
} from "react-icons/fi"
import { getAdminDashboardData } from "../../../../services/operations/adminAPI"

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    const result = await getAdminDashboardData()
    if (result) {
      setData(result)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-75 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAdmins: 0,
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalCategories: 0,
    totalRevenue: 0,
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹ ${stats.totalRevenue.toLocaleString()}`,
      subtitle: "Gross course sales",
      icon: FiDollarSign,
      color: "from-amber-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: `${stats.totalStudents} Students • ${stats.totalInstructors} Instructors`,
      icon: FiUsers,
      color: "from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      subtitle: `${stats.publishedCourses} Published • ${stats.draftCourses} Drafts`,
      icon: FiBookOpen,
      color: "from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-400",
    },
    {
      title: "Course Categories",
      value: stats.totalCategories,
      subtitle: "Active learning domains",
      icon: FiFolder,
      color: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
    },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              Admin Portal
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-100">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="text-sm text-gray-400">
            Platform control center, system statistics, and management overview.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/manage-categories"
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 border border-gray-700 hover:border-gray-500 hover:text-white transition-all active:scale-95"
          >
            <FiLayers />
            <span>Manage Categories</span>
          </Link>
          <Link
            to="/dashboard/all-users"
            className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-yellow-300 transition-all shadow-md shadow-yellow-500/20 active:scale-95"
          >
            <FiUsers />
            <span>View All Users</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className={`rounded-2xl border bg-linear-to-br p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">{card.title}</p>
                <div className="rounded-xl bg-gray-900/60 p-2.5">
                  <Icon className="text-xl" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-gray-400">{card.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* Role Breakdown Bar */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-gray-100">User Demographics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Students</span>
              <span className="font-semibold text-emerald-400">
                {stats.totalUsers > 0
                  ? Math.round((stats.totalStudents / stats.totalUsers) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {stats.totalStudents}
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${
                    stats.totalUsers > 0
                      ? (stats.totalStudents / stats.totalUsers) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Instructors</span>
              <span className="font-semibold text-amber-400">
                {stats.totalUsers > 0
                  ? Math.round((stats.totalInstructors / stats.totalUsers) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {stats.totalInstructors}
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${
                    stats.totalUsers > 0
                      ? (stats.totalInstructors / stats.totalUsers) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Administrators</span>
              <span className="font-semibold text-indigo-400">
                {stats.totalUsers > 0
                  ? Math.round((stats.totalAdmins / stats.totalUsers) * 100)
                  : 0}
                %
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-100">
              {stats.totalAdmins}
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${
                    stats.totalUsers > 0
                      ? (stats.totalAdmins / stats.totalUsers) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split Section: Recent Users & Recent Courses */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">
              Recent Signups
            </h2>
            <Link
              to="/dashboard/all-users"
              className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View all</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-800">
            {data?.recentUsers && data.recentUsers.length > 0 ? (
              data.recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-gray-800/30 px-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.Image ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${u.firstName}%20${u.lastName}`
                      }
                      alt={u.firstName}
                      className="h-9 w-9 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.accountType === "Admin"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : u.accountType === "Instructor"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {u.accountType}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                No users registered yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">
              Platform Courses
            </h2>
            <Link
              to="/dashboard/all-courses"
              className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View all</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-gray-800">
            {data?.recentCourses && data.recentCourses.length > 0 ? (
              data.recentCourses.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-gray-800/30 px-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        c.thumbnail ||
                        "https://via.placeholder.com/150?text=Course"
                      }
                      alt={c.courseName}
                      className="h-10 w-16 rounded-md object-cover border border-gray-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-200 line-clamp-1">
                        {c.courseName}
                      </p>
                      <p className="text-xs text-gray-400">
                        By {c.instructor?.firstName || "Instructor"} • ₹
                        {c.price}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.status === "Published"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {c.status === "Published" ? (
                      <FiCheckCircle className="text-[10px]" />
                    ) : (
                      <FiClock className="text-[10px]" />
                    )}
                    {c.status || "Draft"}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                No courses created yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
