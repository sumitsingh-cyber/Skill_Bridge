import React from "react";

const Highlight = ({ text }) => {
  return (
    <span
      className="
        font-bold
        bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500
        bg-clip-text text-transparent
        transition-all duration-300 ease-out
        hover:from-purple-500 hover:via-pink-500 hover:to-red-500
      "
    >
      {" "}
      {text}
    </span>
  );
};

export default Highlight;
