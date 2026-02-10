import React from "react";

// React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData?.heading)}
      className={`
        w-[360px] lg:w-[30%] h-[300px] box-border cursor-pointer
        rounded-xl overflow-hidden
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-2 hover:scale-[1.02]
        ${
          isActive
            ? "bg-white text-gray-800 shadow-[0_0_30px_rgba(234,179,8,0.35)] border border-yellow-300"
            : "bg-gray-800 text-gray-50 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
        }
      `}
    >
      {/* Top Section */}
      <div className="h-[80%] p-6 flex flex-col gap-4 border-b border-dashed border-gray-400/50">
        <h3
          className={`font-semibold text-[20px] transition-colorsduration-300 ${
            isActive ? "text-gray-900" : " text-yellow-400 "
          }`}
        >
          {cardData?.heading}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed">
          {cardData?.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div
        className={`flex justify-between items-center px-6 py-3 font-medium transition-colors duration-300 ${
          isActive ? "text-blue-500" : "text-gray-300"
        }`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[15px]">
          <HiUsers className="text-lg" />
          <p>{cardData?.level}</p>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-2 text-[15px]">
          <ImTree className="text-lg" />
          <p>{cardData?.lessionNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
