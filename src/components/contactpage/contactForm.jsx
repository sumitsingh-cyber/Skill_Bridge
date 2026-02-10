import React from "react"
import ContactUsForm from "./ContactUsForm"

const ContactForm = () => {
  return (
    <div
      className="
        rounded-2xl p-7 lg:p-14
        flex flex-col gap-4

        bg-gray-900
        border border-white/10

        transition-all duration-500
        hover:border-cyan-400/30
        hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
      "
    >
      {/* Heading */}
      <h1 className="text-4xl leading-tight font-semibold text-gray-100">
        Got an Idea? We&apos;ve got the skills.
        <br />
        Let&apos;s team up
      </h1>

      {/* Subtext */}
      <p className="text-gray-400 max-w-xl">
        Tell us more about yourself and what you&apos;ve got in mind.
      </p>

      {/* Form */}
      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  )
}

export default ContactForm
