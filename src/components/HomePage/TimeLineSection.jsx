import React from "react";
import TimeLineImage from "../../assets/images/timeline.jpg";
import Logo1 from "../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
  {
    Logo: Logo1,
    Heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skill",
  },
  {
    Logo: Logo4,
    Heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className="bg-gray-400 py-20">
      <div className="mx-auto w-11/12 max-w-maxContent flex flex-col lg:flex-row gap-20 items-center">

        {/* ================= LEFT TIMELINE ================= */}
        <div className="lg:w-[45%] flex flex-col gap-5">
          {TimeLine.map((ele, i) => (
            <div key={i} className="group flex flex-col gap-6">

              {/* Item */}
              <div className="flex gap-6 items-start transition-all duration-300 hover:translate-x-1">
                {/* Icon */}
                <div
                  className="
                    w-[52px] h-[52px]
                    bg-white rounded-full
                    flex justify-center items-center
                    shadow-[0_0_30px_#00000012]
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:shadow-[0_0_40px_#38bdf8]
                  "
                >
                  <img src={ele.Logo} alt={ele.Heading} className="w-6 h-6" />
                </div>

                {/* Text */}
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                    {ele.Heading}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {ele.Description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {i !== TimeLine.length - 1 && (
                <div className="hidden lg:block h-14 ml-[26px] border-l border-dashed border-gray-300 transition-all duration-300 group-hover:border-blue-400" />
              )}
            </div>
          ))}
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="relative w-fit group">

          {/* Floating Stats Card */}
          <div
            className="
              absolute lg:left-1/2 lg:bottom-0
              lg:-translate-x-1/2 lg:translate-y-1/2
              bg-green-700 text-white
              flex flex-col lg:flex-row
              uppercase
              rounded-xl
              shadow-xl
              overflow-hidden
              transition-all duration-500
              group-hover:scale-105
            "
          >
            {/* Section 1 */}
            <div className="flex gap-5 items-center px-7 py-6 lg:px-14 border-b lg:border-b-0 lg:border-r border-green-500/40">
              <h1 className="text-3xl font-bold">10</h1>
              <p className="text-green-300 text-xs">
                Years <br /> Experience
              </p>
            </div>

            {/* Section 2 */}
            <div className="flex gap-5 items-center px-7 py-6 lg:px-14">
              <h1 className="text-3xl font-bold">250</h1>
              <p className="text-green-300 text-xs">
                Types <br /> of Courses
              </p>
            </div>
          </div>

          {/* Image */}
          <div
            className="
              overflow-hidden rounded-xl
              shadow-[0_0_30px_rgba(59,130,246,0.25)]
              transition-all duration-500
              group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]
            "
          >
            <img
              src={TimeLineImage}
              alt="Timeline"
              className="object-cover h-[400px] lg:h-full transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimelineSection;
