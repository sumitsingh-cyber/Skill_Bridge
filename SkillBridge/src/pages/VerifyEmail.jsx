import { useEffect, useState } from "react"
import OtpInput from "react-otp-input"
import { Link, useNavigate } from "react-router-dom"
import { BiArrowBack } from "react-icons/bi"
import { RxCountdownTimer } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { sendOtp, signUp } from "../services/operations/authAPI"

function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const { signupData, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!signupData) {
      navigate("/signup")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVerifyAndSignup = (e) => {
    e.preventDefault()

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    )
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
          {/* Glow Overlay */}
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
            Verify Email
          </h1>

          <p className="relative mt-3 text-gray-300 leading-relaxed">
            A verification code has been sent to your email. Enter the code below.
          </p>

          <form onSubmit={handleVerifyAndSignup} className="relative mt-6 space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 8px",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="
                    h-12 w-12 lg:h-14 lg:w-14
                    rounded-lg
                    bg-gray-900 text-gray-100
                    text-center text-lg
                    border border-gray-700
                    outline-none

                    transition-all duration-300
                    focus:border-cyan-400
                    focus:ring-2 focus:ring-cyan-400/40
                    hover:border-gray-500
                  "
                />
              )}
            />

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
              Verify Email
            </button>
          </form>

          <div className="relative mt-6 flex items-center justify-between">
            <Link
              to="/signup"
              className="
                inline-flex items-center gap-2
                text-gray-300
                transition-all duration-300
                hover:text-cyan-300 hover:gap-3
              "
            >
              <BiArrowBack className="text-lg" />
              Back to Signup
            </Link>

            <button
              onClick={() => dispatch(sendOtp(signupData.email))}
              className="
                inline-flex items-center gap-2
                text-cyan-300
                transition-all duration-300
                hover:text-cyan-200
                hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
              "
            >
              <RxCountdownTimer />
              Resend OTP
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail
