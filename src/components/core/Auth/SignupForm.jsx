import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const signupData = { ...formData, accountType }
    dispatch(setSignupData(signupData))
    dispatch(sendOtp(formData.email, navigate))

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  const tabData = [
    { id: 1, tabName: "Student", type: ACCOUNT_TYPE.STUDENT },
    { id: 2, tabName: "Instructor", type: ACCOUNT_TYPE.INSTRUCTOR },
  ]

  return (
    <div className="animate-fadeIn">
      {/* Tabs */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

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
          {/* First & Last Name */}
          <div className="flex gap-x-4">
            <label className="w-full group">
              <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
                First Name <sup className="text-red-400">*</sup>
              </p>
              <input
                required
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                placeholder="Enter first name"
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

            <label className="w-full group">
              <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
                Last Name <sup className="text-red-400">*</sup>
              </p>
              <input
                required
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                placeholder="Enter last name"
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
          </div>

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

          {/* Passwords */}
          <div className="flex gap-x-4">
            <label className="relative w-full group">
              <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
                Create Password <sup className="text-red-400">*</sup>
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
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </label>

            <label className="relative w-full group">
              <p className="mb-1 text-sm text-gray-300 group-focus-within:text-gray-100">
                Confirm Password <sup className="text-red-400">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm password"
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
              <span
                onClick={() => setShowConfirmPassword((p) => !p)}
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
                {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </label>
          </div>

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
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupForm
