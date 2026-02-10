import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"


import { resetPassword } from "../services/operations/authAPI"

function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
   const { token } = useParams()
  const { loading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
  e.preventDefault()
  dispatch(resetPassword(password, confirmPassword, token, navigate))
}


  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      {loading ? (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      ) : (
        <div
          className="
            group relative w-full max-w-md rounded-2xl
            bg-gray-800/90 backdrop-blur
            p-6 lg:p-8

            shadow-xl shadow-black/40
            transition-all duration-300 ease-out

            hover:-translate-y-1
            hover:shadow-2xl hover:shadow-cyan-500/25
            hover:ring-1 hover:ring-cyan-400/40
          "
        >
          {/* Glow overlay */}
          <div
            className="
              pointer-events-none absolute inset-0 rounded-2xl
              bg-linear-to-br from-cyan-400/20 via-blue-500/20 to-purple-500/20
              opacity-0 blur-xl
              transition-opacity duration-300
              group-hover:opacity-100
            "
          />

          <h1 className="relative text-3xl font-semibold text-gray-100">
            Choose new password
          </h1>

          <p className="relative mt-3 text-gray-300 leading-relaxed">
            Almost done. Enter your new password and you’re all set.
          </p>

          <form onSubmit={handleOnSubmit} className="relative mt-6 space-y-5">
            {/* New Password */}
            <label className="relative block">
              <span className="mb-1 block text-sm text-gray-300">
                New Password <sup className="text-red-400">*</sup>
              </span>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter new password"
                className="
                  w-full rounded-lg
                  bg-gray-900 text-gray-100
                  px-4 py-3 pr-12
                  border border-gray-700
                  outline-none

                  transition-all duration-300
                  focus:border-cyan-400
                  focus:ring-2 focus:ring-cyan-400/40
                  hover:border-gray-500
                "
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="
                  absolute right-3 top-9
                  cursor-pointer
                  text-gray-400
                  transition-colors duration-300
                  hover:text-cyan-300
                "
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </label>

            {/* Confirm Password */}
            <label className="relative block">
              <span className="mb-1 block text-sm text-gray-300">
                Confirm New Password <sup className="text-red-400">*</sup>
              </span>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm new password"
                className="
                  w-full rounded-lg
                  bg-gray-900 text-gray-100
                  px-4 py-3 pr-12
                  border border-gray-700
                  outline-none

                  transition-all duration-300
                  focus:border-cyan-400
                  focus:ring-2 focus:ring-cyan-400/40
                  hover:border-gray-500
                "
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="
                  absolute right-3 top-9
                  cursor-pointer
                  text-gray-400
                  transition-colors duration-300
                  hover:text-cyan-300
                "
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </label>

            <button
              type="submit"
              className="
                w-full rounded-lg
                bg-gray-100 text-gray-900
                py-3 font-medium

                transition-all duration-300
                hover:bg-white
                hover:shadow-lg hover:shadow-cyan-400/40
                active:scale-[0.98]
              "
            >
              Reset Password
            </button>
          </form>

          <div className="relative mt-6">
            <Link
              to="/login"
              className="
                inline-flex items-center gap-2
                text-gray-300
                transition-all duration-300
                hover:text-cyan-300 hover:gap-3
              "
            >
              <BiArrowBack size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword
