import React from "react";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";
import CTAButton from "./CTAButton";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  codeColor,
}) => {
  return (
    <div
  className={`flex my-20 gap-10 justify-between
    flex-col lg:flex-row ${
      position === "flex-row-reverse" ? "lg:flex-row-reverse" : "lg:flex-row"
    }`}
>

      {/* ================= LEFT CONTENT ================= */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {heading}

        <p className="text-gray-300 text-base font-medium w-[85%]">
          {subheading}
        </p>

        <div className="flex gap-7 mt-4">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* ================= CODE BLOCK ================= */}
      <div className="relative w-full lg:w-[470px] group">

        {/* 🔵 Circular Glow */}
        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            h-[520px] w-[520px]
            rounded-full
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            blur-3xl opacity-40
            transition-opacity duration-500
            group-hover:opacity-60
            pointer-events-none
          "
        />

        {/* Code Card */}
        <div
          className="
            relative flex rounded-xl p-4
            bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
            backdrop-blur-md
            shadow-lg
            transition-all duration-500 ease-out
            hover:scale-[1.03]
            hover:shadow-2xl hover:shadow-blue-500/30
          "
        >
          {/* Line Numbers */}
          <div className="pr-4 text-gray-300 text-sm font-mono select-none">
            {codeblock.split("\n").map((_, i) => (
              <p key={i}>{i + 1}</p>
            ))}
          </div>

          {/* Code */}
          <div
            className={`font-mono text-sm ${codeColor} whitespace-pre-line
              transition-colors duration-300
              group-hover:text-yellow-300
            `}
          >
            <TypeAnimation
              sequence={[codeblock, 2000]}
              cursor
              repeat={Infinity}
              omitDeletionAnimation
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
