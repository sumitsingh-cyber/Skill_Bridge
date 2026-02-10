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
            absolute right-0 top-[120%] z-1000 w-44
            overflow-hidden rounded-xl border border-gray-600
            bg-linear-to-b from-gray-800 to-gray-900
            shadow-lg shadow-black/40
            animate-fadeIn
          "
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="
              flex items-center gap-x-2 px-4 py-3 text-sm
              text-gray-200
              transition-all duration-200
              hover:bg-gray-700 hover:text-white
            ">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          <div className="h-px bg-gray-600" />

          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="
              flex items-center gap-x-2 px-4 py-3 text-sm
              text-gray-200 cursor-pointer
              transition-all duration-200
              hover:bg-red-500/10 hover:text-red-400
            "
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  )
}
