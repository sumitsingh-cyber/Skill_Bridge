import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/contactpage/contactDetails"
import ContactForm from "../components/contactpage/contactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div className="bg-gray-950 text-gray-200">
      {/* Main Contact Section */}
            <div className="
                mx-auto mt-12
                flex max-w-11/12 max-w-maxContent
                flex-col gap-6
                lg:flex-row
            ">
                {/* Contact Details */}
                <div className="lg:w-[38%]">
                <ContactDetails />
                </div>

                {/* Contact Form */}
                <div className="lg:w-[62%]">
                <ContactForm />
                </div>
            </div>

      {/* Reviews */}
      <div
        className="
          relative mx-auto my-14
          flex w-11/12 max-w-maxContent
          flex-col items-center gap-6
          rounded-2xl bg-gray-900 p-6
          border border-white/10
          transition-all duration-500
          hover:border-cyan-400/30
          hover:shadow-[0_0_35px_rgba(34,211,238,0.2)]
        "
      >
        <h1 className="text-center text-3xl font-semibold">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  )
}

export default Contact
