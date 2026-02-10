import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI.js"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      {/* Profile Information */}
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
          Profile Information
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className="text-sm text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && (
              <span className="text-xs text-yellow-400">
                Please enter your first name.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="text-sm text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && (
              <span className="text-xs text-yellow-400">
                Please enter your last name.
              </span>
            )}
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="text-sm text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("dateOfBirth", {
                required: "Please enter your Date of Birth.",
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <span className="text-xs text-yellow-400">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="text-sm text-gray-300">
              Gender
            </label>
            <select
              id="gender"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((ele, i) => (
                <option key={i} value={ele}>
                  {ele}
                </option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-xs text-yellow-400">
                Please select your gender.
              </span>
            )}
          </div>
        </div>

        {/* Contact + About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className="text-sm text-gray-300">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter contact number"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("contactNumber", {
                required: "Please enter your Contact Number.",
                minLength: { value: 10, message: "Invalid Contact Number" },
                maxLength: { value: 12, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
              <span className="text-xs text-yellow-400">
                {errors.contactNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="text-sm text-gray-300">
              About
            </label>
            <input
              type="text"
              id="about"
              placeholder="Enter bio details"
              className="
                rounded-lg border border-gray-700 bg-gray-800 px-4 py-2
                text-gray-100 placeholder-gray-500
                transition-all duration-200
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && (
              <span className="text-xs text-yellow-400">
                Please enter your bio.
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
            transition-all duration-200
            hover:bg-gray-600
            active:scale-95
          "
        >
          Cancel
        </button>

        <IconBtn
          type="submit"
          text="Save"
          className="
            bg-indigo-600 text-white
            hover:bg-indigo-500
            shadow-md shadow-indigo-600/30
            hover:shadow-indigo-500/50
            transition-all duration-300
            active:scale-95
          "
        />
      </div>
    </form>
  )
}
