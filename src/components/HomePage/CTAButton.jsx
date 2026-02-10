import React from "react";
import { Link } from "react-router-dom";

const CTAButton = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`
          inline-flex items-center justify-center
          px-6 py-3 text-sm font-semibold rounded-lg
          transition-all duration-300 ease-out
          transform
          ${
            active
              ? "bg-yellow-400 text-black shadow-md hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }
          hover:scale-95
          hover:shadow-lg
          active:scale-90
          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
        `}
      >
        {children}
      </div>
    </Link>
  );
};

export default CTAButton;
