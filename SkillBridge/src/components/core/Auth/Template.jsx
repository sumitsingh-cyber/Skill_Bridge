import { useSelector } from "react-redux"

import LoginForm from "./loginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner" aria-label="Loading"></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between  py-12 md:flex-row md:gap-x-12">
          
          <div className="mx-auto w-11/12 max-w-112.5 md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-9.5 text-gray-50">
              {title}
            </h1>

            <p className="mt-4 text-[1.125rem] leading-6.5">
              <span className="text-gray-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-400">
                {description2}
              </span>
            </p>

            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          
<div className="relative mx-auto w-11/12 max-w-137.5 md:mx-0 group">
  {/* Glow layer */}
  <div
    className="
      absolute inset-0 rounded-3xl
      bg-linear-to-r from-cyan-400/25 via-blue-500/25 to-indigo-500/25
      blur-3xl opacity-0
      transition-opacity duration-500
      group-hover:opacity-100
    "
  ></div>

  <img
    src={image}
    alt="Authentication illustration"
    loading="lazy"
    className="
      relative z-10 w-full
      rounded-3xl
      border border-white/10
      shadow-xl shadow-black/40
      py-10

      transition-all duration-500 ease-out
      hover:scale-[1.04]
      hover:border-cyan-400/40
      hover:shadow-[0_0_50px_rgba(34,211,238,0.35)]
    "
  />
</div>



        </div>
      )}
    </div>
  )
}

export default Template
