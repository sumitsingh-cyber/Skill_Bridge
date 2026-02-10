import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
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

          <h1 className="relative text-3xl font-semibold text-yellow-100">
            {!emailSent ? "Reset your password" : "Check your email"}
          </h1>

          <p className="relative mt-3 text-gray-300 leading-relaxed">
            {!emailSent
              ? "No worries. Enter your email and we,ll send you instructions to reset your password."
              : "We,ve sent a password reset link to "}
            {emailSent && (
              <span className="font-medium text-gray-100">{email}</span>
            )}
          </p>

          <form onSubmit={handleOnSubmit} className="relative mt-6 space-y-5">
            {!emailSent && (
              <label className="block">
                <span className="mb-1 block text-sm text-blue-300">
                  Email Address <sup className="text-red-400">*</sup>
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="
                    w-full rounded-lg
                    bg-gray-900 text-gray-100
                    px-4 py-3
                    border border-gray-700
                    outline-none

                    transition-all duration-300
                    focus:border-cyan-400
                    focus:ring-2 focus:ring-cyan-400/40
                    hover:border-gray-500
                  "
                />
              </label>
            )}

            <button
              type="submit"
              className="
                w-full rounded-lg
                bg-yellow-400 text-gray-900
                py-3 font-medium

                transition-all duration-300
                hover:bg-white
                hover:shadow-lg hover:shadow-cyan-400/40
                active:scale-[0.98]
              "
            >
              {!emailSent ? "Submit" : "Resend Email"}
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
              <BiArrowBack className="text-lg" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
