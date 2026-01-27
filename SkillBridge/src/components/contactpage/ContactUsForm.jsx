import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import CountryCode from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiconnector"
import { contactusEndpoint } from "../../services/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    try {
      setLoading(true)
      await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  const inputClass = `
    w-full rounded-lg bg-gray-800 p-3
    text-gray-100 placeholder-gray-400
    border border-gray-700

    transition-all duration-300
    hover:border-gray-500
    hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]

    focus:outline-none
    focus:border-cyan-400
    focus:ring-2 focus:ring-cyan-400/30
  `

  const labelClass = "text-sm font-medium text-gray-300"

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-7 animate-fadeIn"
    >
      {/* First & Last Name */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            placeholder="Enter first name"
            className={inputClass}
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-xs text-red-400">
              Please enter your first name
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            placeholder="Enter last name"
            className={inputClass}
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Email Address</label>
        <input
          type="email"
          placeholder="Enter email address"
          className={inputClass}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-xs text-red-400">
            Please enter a valid email address
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Phone Number</label>

        <div className="flex gap-4">
          <select
            className={`${inputClass} w-22.5`}
            {...register("countrycode", { required: true })}
          >
            {CountryCode.map((ele, i) => (
              <option key={i} value={ele.code}>
                {ele.code}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="12345 67890"
            className={inputClass}
            {...register("phoneNo", {
              required: "Please enter your phone number",
              minLength: { value: 10, message: "Invalid phone number" },
              maxLength: { value: 12, message: "Invalid phone number" },
            })}
          />
        </div>

        {errors.phoneNo && (
          <span className="text-xs text-red-400">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Message</label>
        <textarea
          rows="6"
          placeholder="Enter your message here"
          className={inputClass}
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="text-xs text-red-400">
            Please enter your message
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          mt-4 rounded-xl py-3 font-semibold text-white
          bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600

          transition-all duration-300
          hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500
          hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]
          hover:scale-[1.02]

          active:scale-[0.97]
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}

export default ContactUsForm
