import React from "react";
import HighlightText from "./Highlight";
import CTAButton from "./CTAButton";
import Know_your_progress from "../../assets/images/Know_your_progress.png";
import Compare_with_others from "../../assets/images/Compare_with_others.png";
import Plan_your_lessons from "../../assets/images/Plan_your_lessons.png";

const LearningLanguageSection = () => {
  return (
    <div className="relative py-16">

      {/* ================= HEADING ================= */}
      <div className="text-4xl font-semibold text-center text-white my-10">
        Your swiss knife for{" "}
        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
          learning any language
        </span>

        {/* Sub heading */}
        <div className="text-center text-gray-300 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-4">
          Using Spin makes learning multiple languages easy. With 20+ languages,
          realistic voice-over, progress tracking, custom schedules, and more.
        </div>

        {/* ================= IMAGES ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-center mt-12 gap-6 relative">

          {/* Image 1 */}
          <div className="relative group lg:-mr-32">
            <div className="absolute inset-0 rounded-xl bg-blue-500/40 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <img
              src={Know_your_progress}
              alt="Know your progress"
              className="
                relative object-contain
                transition-all duration-500 ease-out
                group-hover:scale-105 group-hover:-translate-y-2
                drop-shadow-xl
              "
            />
          </div>

          {/* Image 2 (center focus) */}
          <div className="relative group z-10 lg:-mb-10 -mt-12">
            <div className="absolute inset-0 rounded-xl bg-purple-500/40 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <img
              src={Compare_with_others}
              alt="Compare with others"
              className="
                relative object-contain
                transition-all duration-500 ease-out
                group-hover:scale-110 group-hover:-translate-y-3
                drop-shadow-2xl
              "
            />
          </div>

          {/* Image 3 */}
          <div className="relative group lg:-ml-36 lg:-mt-5 -mt-16">
            <div className="absolute inset-0 rounded-xl bg-pink-500/40 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <img
              src={Plan_your_lessons}
              alt="Plan your lessons"
              className="
                relative object-contain
                transition-all duration-500 ease-out
                group-hover:scale-105 group-hover:-translate-y-2
                drop-shadow-xl
              "
            />
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="w-fit mx-auto lg:mb-20 mb-10 -mt-4">
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
