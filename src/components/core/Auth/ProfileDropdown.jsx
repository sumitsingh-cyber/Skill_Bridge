import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnclickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  return (
    <button
      className="relative focus:outline-none"
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Trigger */}
      <div className="flex items-center gap-x-2 rounded-full px-1.5 py-1 transition-all duration-200 hover:bg-gray-700">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-8 rounded-full object-cover ring-2 ring-gray-600"
        />
        <AiOutlineCaretDown
          className={`text-sm text-gray-200 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="
            absolute right-0 top-[120%] z-1000 w-52
            overflow-hidden rounded-2xl border border-gray-700
            bg-gray-900/95 backdrop-blur-xl
            shadow-2xl shadow-black/60
            animate-fadeIn
          "
        >
          {/* User Info Header */}
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-sm font-semibold text-gray-100 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate font-mono">
              {user?.email}
            </p>
            <span
              className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                user?.accountType === "Admin"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : user?.accountType === "Instructor"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {user?.accountType || "Student"}
            </span>
          </div>

          {/* Links */}
          <div className="py-1">
            {user?.accountType === "Admin" ? (
              <Link to="/dashboard/admin" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-x-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white">
                  <VscDashboard className="text-base text-purple-400" />
                  Admin Dashboard
                </div>
              </Link>
            ) : user?.accountType === "Instructor" ? (
              <Link to="/dashboard/instructor" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-x-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white">
                  <VscDashboard className="text-base text-amber-400" />
                  Instructor Dashboard
                </div>
              </Link>
            ) : (
              <Link to="/dashboard/enrolled-courses" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-x-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white">
                  <VscDashboard className="text-base text-emerald-400" />
                  Enrolled Courses
                </div>
              </Link>
            )}

            <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white">
                <VscDashboard className="text-base text-gray-400" />
                My Profile
              </div>
            </Link>

            <Link to="/dashboard/settings" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-x-2.5 px-4 py-2.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-800 hover:text-white">
                <VscDashboard className="text-base text-gray-400" />
                Settings
              </div>
            </Link>
          </div>

          <div className="h-px bg-gray-800" />

          {/* Logout */}
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="
              flex items-center gap-x-2.5 px-4 py-3 text-xs font-medium
              text-red-400 cursor-pointer
              transition-colors
              hover:bg-red-500/10 hover:text-red-300
            "
          >
            <VscSignOut className="text-base" />
            Logout
          </div>
        </div>
      )}

    </button>
  )
}
