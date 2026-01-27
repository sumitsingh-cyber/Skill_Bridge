import React from "react"
import ContactUsForm from "../../components/contactpage/ContactUsForm"

const ContactFormSection = () => {
  return (
    <section className="mx-auto w-full max-w-3xl animate-fadeIn">
      {/* Heading */}
      <h1 className="text-center text-4xl font-semibold text-gray-100">
        Get in Touch
      </h1>

      <p className="mt-3 text-center text-gray-400">
        We'd love to hear from you. Please fill out the form below.
      </p>

      {/* Form Card */}
      <div
        className="
          mt-12 rounded-2xl p-8
          bg-gray-900
          border border-white/10

          transition-all duration-500
          hover:border-cyan-400/30
          hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]
        "
      >
        <ContactUsForm />
      </div>
    </section>
  )
}

export default ContactFormSection
