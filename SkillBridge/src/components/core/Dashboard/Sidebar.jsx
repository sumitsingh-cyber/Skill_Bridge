import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-55 place-items-center border-r border-gray-700 bg-gray-900">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <aside className="flex h-[calc(100vh-3.5rem)] min-w-55 flex-col border-r border-gray-700 bg-gray-900 py-10">
        
        {/* Navigation Links */}
        <nav className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
              />
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-auto my-6 h-px w-10/12 bg-gray-700" />

        {/* Bottom Actions */}
        <div className="flex flex-col gap-1">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />

          {/* Logout */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="
              mx-4 mt-2 rounded-md px-4 py-2
              text-sm font-medium text-gray-300 transition-shadow duration-200
              hover:bg-gray-800 hover:text-white
              hover:shadow-[0_0_12px_rgba(255,255,255,0.12)]
              active:scale-95
            "
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
