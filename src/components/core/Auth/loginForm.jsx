import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <div className="animate-fadeIn">
      {/* Form Card */}
      <div
        className="
          mt-4 rounded-2xl p-6
          border border-white/10
          transition-all duration-500
          hover:border-cyan-400/30
          hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]
        "
      >
        <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-5">
          {/* Email */}
          <label className="w-full group">
            <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
              Email Address <sup className="text-red-400">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="
                w-full rounded-lg bg-gray-800 p-3
                text-gray-100 placeholder-gray-400
                border border-gray-700
                transition-all duration-300
                hover:border-gray-500
                hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]
                focus:outline-none
                focus:border-cyan-400
                focus:ring-2 focus:ring-cyan-400/30
              "
            />
          </label>

          {/* Password */}
          <label className="relative w-full group">
            <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
              Password <sup className="text-red-400">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter password"
              className="
                w-full rounded-lg bg-gray-800 p-3 pr-10
                text-gray-100 placeholder-gray-400
                border border-gray-700
                transition-all duration-300
                hover:border-gray-500
                hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]
                focus:outline-none
                focus:border-cyan-400
                focus:ring-2 focus:ring-cyan-400/30
              "
            />

            {/* Eye icon */}
            <span
              onClick={() => setShowPassword((p) => !p)}
              className="
                absolute right-3 top-9.5
                cursor-pointer text-gray-400
                transition-all duration-200
                hover:text-cyan-300
                hover:scale-110
                hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
                active:scale-95
              "
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>

            <Link to="/forgot-password">
              <p className="mt-1 ml-auto max-w-max text-xs text-gray-400 hover:text-gray-200 transition-colors">
                Forgot Password?
              </p>
            </Link>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="
              mt-6 rounded-xl py-2.5 font-medium text-white
              bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600
              transition-all duration-300
              hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500
              hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]
              hover:scale-[1.02]
              active:scale-[0.97]
            "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
