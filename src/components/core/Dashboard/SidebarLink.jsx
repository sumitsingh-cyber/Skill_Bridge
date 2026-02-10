import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const dispatch = useDispatch()

  // Safely resolve icon
  const Icon = Icons[iconName] ?? Icons.VscCircleLargeOutline

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={({ isActive }) =>
        `
          relative flex items-center gap-2
          px-8 py-2 text-sm font-medium
          transition-colors duration-200

          ${
            isActive
              ? "bg-cyan-500/10 text-cyan-300"
              : "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator */}
          <span
            className={`
              absolute left-0 top-0 h-full w-0.75
              bg-cyan-400
              transition-opacity duration-200
              ${isActive ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Icon */}
          <Icon className="text-lg shrink-0" />

          {/* Label */}
          <span>{link.name}</span>
        </>
      )}
    </NavLink>
  )
}
