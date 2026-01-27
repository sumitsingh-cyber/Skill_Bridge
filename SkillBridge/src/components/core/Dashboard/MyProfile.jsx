import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      {/* Page Title */}
      <h1 className="mb-14 text-3xl font-medium text-gray-100">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900 p-8 px-12 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-shadow duration-300">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-19.5 rounded-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-100">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onClick={() => navigate("/dashboard/settings")}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border border-gray-700 bg-gray-900 p-8 px-12 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-shadow duration-300">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-gray-100">
            About
          </p>
          <IconBtn
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`text-sm font-medium transition-colors duration-200 ${
            user?.additionalDetails?.about
              ? "text-gray-200"
              : "text-gray-400 italic"
          }`}
        >
          {user?.additionalDetails?.about ??
            "Write Something About Yourself"}
        </p>
      </div>

      {/* Personal Details Section */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border border-gray-700 bg-gray-900 p-8 px-12 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-shadow duration-300">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-gray-100">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onClick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-125 justify-between">
          {/* Left Column */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-500">First Name</p>
              <p className="text-sm font-medium text-gray-100">
                {user?.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-100">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Gender</p>
              <p className="text-sm font-medium text-gray-100">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-gray-500">Last Name</p>
              <p className="text-sm font-medium text-gray-100">
                {user?.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-100">
                {user?.additionalDetails?.contactNumber ??
                  "Add Contact Number"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">Date Of Birth</p>
              <p className="text-sm font-medium text-gray-100">
                {formattedDate(
                  user?.additionalDetails?.dateOfBirth
                ) ?? "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
