import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon2 from "react-icons/io5"
import * as Icon3 from "react-icons/hi2"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat with us",
    description: "Our friendly team is here to help.",
    details: "info@skillbridge.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore - 560016",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon – Fri from 8am to 5pm",
    details: "+123 456 7869",
  },
]

const ContactDetails = () => {
  return (
    <div
      className="
        flex flex-col gap-6
        rounded-2xl bg-gray-900
        p-5 lg:p-7
        border border-white/10
      "
    >
      {contactDetails.map((ele, i) => {
        const Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]

        return (
          <div
            key={i}
            className="
              group rounded-xl p-4
              border border-white/5
              transition-all duration-300

              hover:border-cyan-400/30
              hover:bg-gray-800
              hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-lg bg-gray-800 text-cyan-400
                  transition-all duration-300
                  group-hover:bg-cyan-500/10
                  group-hover:scale-110
                "
              >
                <Icon size={22} />
              </div>

              <h1 className="text-lg font-semibold text-gray-100">
                {ele.heading}
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              {ele.description}
            </p>

            <p className="mt-1 font-medium text-gray-200">
              {ele.details}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails
