import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div
      className="
        my-12 flex gap-x-6 rounded-2xl border border-red-800/60
        bg-linear-to-br from-red-950 via-gray-900 to-red-950
        p-8 px-12
        transition-all duration-300
        hover:shadow-xl hover:shadow-red-900/30
      "
    >
      {/* Icon */}
      <div
        className="
          flex h-14 w-14 items-center justify-center rounded-full
          bg-red-900/60
          ring-2 ring-red-700/60
        "
      >
        <FiTrash2 className="text-2xl text-red-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">
          Delete Account
        </h2>

        <div className="max-w-130 text-sm leading-relaxed text-gray-300">
          <p>Are you sure you want to delete your account?</p>
          <p>
            This account may include paid courses. Deleting your account is
            <span className="font-semibold text-red-400"> permanent </span>
            and will remove all data associated with it.
          </p>
        </div>

        {/* Danger Action */}
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="
            mt-2 w-fit italic
            text-sm text-red-400
            transition-all duration-200
            hover:text-red-300 hover:underline
            active:scale-95
          "
        >
          I want to delete my account
        </button>
      </div>
    </div>
  )
}
