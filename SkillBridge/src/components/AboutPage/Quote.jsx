import React from "react"
import HighlightText from "../HomePage/Highlight"

const Quote = () => {
  return (
    <div
      className="
        mx-auto max-w-4xl
        py-10 pb-24 px-4
        text-center
        text-lg md:text-4xl
        font-semibold
        leading-snug
        text-gray-200
      "
    >
      We are passionate about revolutionizing the way we learn. Our innovative
      platform{" "}
      <HighlightText text={"combines technology"} />
      ,{" "}
      <span
        className="
          bg-linear-to-r from-gray-200 to-gray-400
          bg-clip-text text-transparent font-bold
        "
      >
        expertise
      </span>
      , and community to create an{" "}
      <span
        className="
          bg-linear-to-r from-cyan-300 via-blue-400 to-indigo-400
          bg-clip-text text-transparent font-bold
        "
      >
        unparalleled educational experience
      </span>
      .
    </div>
  )
}

export default Quote
