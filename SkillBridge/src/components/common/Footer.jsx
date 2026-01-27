import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/logonav.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-gray-700">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-gray-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-gray-700">

          {/* ================= SECTION 1 ================= */}
          <div className="lg:w-[50%] flex flex-wrap justify-between lg:border-r lg:border-gray-700 pl-3 lg:pr-5 gap-3">

            {/* Company */}
            <div className="w-[30%] flex flex-col gap-3 mb-7">
              <img src={Logo} alt="" className="object-contain" />

              <h1 className="text-white font-semibold text-[16px]">
                Company
              </h1>

              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => (
                  <div
                    key={i}
                    className="
                      text-[14px] cursor-pointer
                      text-gray-50
                      transition-all duration-300
                      hover:text-gray-50
                      hover:translate-x-1
                      hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
                    "
                  >
                    <Link to={ele.toLowerCase()}>{ele}</Link>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 text-lg mt-2">
                {[FaFacebook, FaGoogle, FaTwitter, FaYoutube].map((Icon, i) => (
                  <Icon
                    key={i}
                    className="
                      cursor-pointer
                       text-gray-50
                      transition-all duration-300
                      hover:text-white
                      hover:scale-110
                      hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]
                    "
                  />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="w-[48%] lg:w-[30%] mb-7">
              <h1 className="text-gray-50 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => (
                  <div
                    key={index}
                    className="
                      text-[14px] cursor-pointer
                       text-gray-50
                      transition-all duration-300
                      hover:text-blue-500 
                      hover:underline
                      hover:translate-x-1
                      hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]
                    "
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              <h1 className="text-gray-50 font-semibold text-[16px] mt-7">
                Support
              </h1>

              <div
                className="
                  text-[14px] cursor-pointer mt-2
                   text-gray-50
                  transition-all duration-300
                  hover:text-gray-50
                  hover:translate-x-1
                  hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]
                "
              >
                <Link to="/help-center">Help Center</Link>
              </div>
            </div>

            {/* Plans + Community */}
            <div className="w-[48%] lg:w-[30%] mb-7">
              <h1 className="text-gray-50 font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => (
                  <div
                    key={index}
                    className="
                      text-[14px] cursor-pointer
                       text-gray-50
                      transition-all duration-300
                      hover:text-gray-50
                      hover:translate-x-1
                      hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]
                    "
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              <h1 className="text-gray-50 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => (
                  <div
                    key={index}
                    className="
                      text-[14px] cursor-pointer
                       text-gray-50
                      transition-all duration-300
                      hover:text-gray-50
                      hover:translate-x-1
                      hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]
                    "
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= SECTION 2 ================= */}
          <div className="lg:w-[50%] flex flex-wrap justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => (
              <div key={i} className="w-[48%] lg:w-[30%] mb-7">
                <h1 className="text-gray-50 font-semibold text-[16px]">
                  {ele.title}
                </h1>

                <div className="flex flex-col gap-2 mt-2">
                  {ele.links.map((link, index) => (
                    <div
                      key={index}
                      className="
                        text-[14px] cursor-pointer
                         text-gray-50
                        transition-all duration-300
                        hover:text-red-900
                        hover:translate-x-1
                        hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]
                      "
                    >
                      <Link to={link.link}>{link.title}</Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="flex items-center justify-between w-11/12 max-w-maxContent text-gray-400 mx-auto pb-14 text-sm">
        <div className="flex flex-col lg:flex-row gap-3 w-full items-center justify-between">

          <div className="flex">
            {BottomFooter.map((ele, i) => (
              <div
                key={i}
                className={`
                  px-3 transition-all duration-300
                  hover:text-gray-50
                  hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
                  ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-gray-700"
                  }
                `}
              >
                <Link to={ele.split(" ").join("-").toLowerCase()}>
                  {ele}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center transition-colors duration-300  text-gray-50 hover:text-gray-50">
            Made with ❤️ Sumit © 2026 SkillBridge
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
