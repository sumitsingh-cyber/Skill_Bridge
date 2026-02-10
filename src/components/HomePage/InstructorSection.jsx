import React from "react";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../assets/images/prof.jpg";
import HighlightText from "./Highlight";

const InstructorSection = () => {
  return (
    <div className="py-20">
      <div className="flex flex-col lg:flex-row gap-20 items-center">

        {/* ================= IMAGE ================= */}
        <div className="lg:w-[50%] relative group">
          {/* Glow */}
          <div
            className="
              absolute inset-0
              rounded-2xl
              bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40
              blur-3xl
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />

          {/* Image */}
          <img
            src={Instructor}
            alt="Instructor"
            className="
              relative rounded-2xl
              transition-all duration-500 ease-out
              group-hover:scale-105 group-hover:-translate-y-2
              shadow-xl
            "
          />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="lg:w-[50%] flex gap-10 flex-col">
          <h1
            className="
              lg:w-[60%] text-4xl font-semibold text-white
              transition-transform duration-300
              hover:scale-[1.02]
            "
          >
            Become an <HighlightText text={"instructor"} />
          </h1>

          <p
            className="
              font-medium text-[16px] text-justify w-[90%]
              text-richblack-300
              transition-colors duration-300
              hover:text-richblack-200
            "
          >
            Instructors from around the world teach millions of students on
              SkillBridge. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-3">
                Start Teaching Today
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </CTAButton>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorSection;
