import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI.js"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched", // 🔥 IMPORTANT
  })

  const newPassword = watch("newPassword")

  const submitPasswordForm = async ({
    confirmPassword,
    oldPassword,
    newPassword,
  }) => {
    // 🔒 Frontend safety check (NO backend change)
    if (!oldPassword || !newPassword) return

    await changePassword(token, { oldPassword, newPassword })
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      {/* Password Card */}
      <div
        className="
          my-10 flex flex-col gap-y-6 rounded-2xl
          border border-gray-700
          bg-linear-to-br from-gray-900 via-gray-800 to-gray-900
          p-8 px-12
          transition-all duration-300
          hover:shadow-xl hover:shadow-black/40
        "
      >
        <h2 className="text-lg font-semibold text-gray-100">
          Password
        </h2>

        <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap">
          {/* Current Password */}
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="oldPassword" className="text-sm text-gray-300">
              Current Password
            </label>

            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              placeholder="Enter current password"
              className="
                w-full rounded-lg border border-gray-700 bg-gray-800
                px-4 py-2 pr-12
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("oldPassword", {
                required: "Current password is required",
              })}
            />

            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 cursor-pointer text-gray-400 hover:text-gray-200"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>

            {errors.oldPassword && (
              <span className="text-xs text-yellow-400">
                {errors.oldPassword.message}
              </span>
            )}
          </div>

          {/* New Password */}
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="newPassword" className="text-sm text-gray-300">
              New Password
            </label>

            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              className="
                w-full rounded-lg border border-gray-700 bg-gray-800
                px-4 py-2 pr-12
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("newPassword", {
                required: "New password is required",
              })}
            />

            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 cursor-pointer text-gray-400 hover:text-gray-200"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>

            {errors.newPassword && (
              <span className="text-xs text-yellow-400">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm New Password
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm new password"
              className="
                w-full rounded-lg border border-gray-700 bg-gray-800
                px-4 py-2 pr-12
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />

            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 cursor-pointer text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>

            {errors.confirmPassword && (
              <span className="text-xs text-yellow-400">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="
            rounded-lg bg-gray-700 px-5 py-2
            text-sm font-medium text-gray-200
            hover:bg-gray-600 active:scale-95
          "
        >
          Cancel
        </button>

        <IconBtn
          type="submit"
          text="Update"
          pace
          disabled={!isValid}
          className={`
            bg-indigo-600 text-white transition-all duration-300
            ${!isValid
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-500 active:scale-95"}
          `}
        />
      </div>
    </form>
  )
}
