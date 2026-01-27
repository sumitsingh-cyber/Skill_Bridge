import React from "react"

import BannerImage1 from "../assets/images/about3.avif"
import BannerImage2 from "../assets/images/about4.webp"
import BannerImage3 from "../assets/images/about5.webp"

import FoundingStory from "../assets/images/FoundingStory.png"
import ContactFormSection from "../components/AboutPage/ContactFormSection"
import LearningGrid from "../components/AboutPage/LearningGrid"
import Quote from "../components/AboutPage/Quote"
import StatsComponenet from "../components/AboutPage/Stats"
import HighlightText from "../components/HomePage/Highlight"
import ReviewSlider from "../components/common/ReviewSlider"
import Footer from "../components/common/Footer"

const About = () => {
  return (
    <div className="bg-gray-950 text-gray-200">
      {/* Hero Section */}
      <section className="bg-gray-900">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col gap-10 text-center">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation in Online Education for a{" "}
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-4 text-base font-medium text-gray-400 lg:w-[95%]">
              SkillBridge is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>

          <div className="sm:h-17.5 lg:h-37.5" />

          <div className="absolute bottom-0 left-1/2 grid w-full -translate-x-1/2 translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            {[BannerImage1, BannerImage2, BannerImage3].map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="
                  rounded-xl shadow-lg
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]
                "
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="border-b border-gray-800">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-10 text-gray-400">
          <div className="h-25" />
          <Quote />
        </div>
      </section>

      {/* Story + Vision */}
      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col  text-gray-400">
          
          {/* Founding Story */}
          <div className="flex flex-col items-center justify-between lg:flex-row">
            
            {/* Text */}
            <div
              className="
                my-24 flex lg:w-[50%] flex-col gap-6
                rounded-2xl p-8
                border border-white/10 bg-gray-900
                transition-all duration-500
                hover:border-cyan-400/30
                hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]
              "
            >
              <h1 className="bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-4xl font-semibold text-transparent">
                Our Founding Story
              </h1>

              <p className="text-base font-medium">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>

              <p className="text-base font-medium">
                We believed that education should not be confined to classrooms
                or geography. Our vision was to empower individuals everywhere
                to unlock their full potential.
              </p>
            </div>

            {/* Image */}
            <div className="my-24 flex items-center justify-center lg:w-[45%]">
              <img
                src={FoundingStory}
                alt="Founding Story"
                className="
                  rounded-2xl
                  border border-white/10 bg-gray-900
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:border-cyan-400/30
                  hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]
                "
              />
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
            {[
              {
                title: "Our Vision",
                text:
                  "With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content.",
              },
              {
                title: "Our Mission",
                text:
                  "Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  my-24 flex lg:w-[40%] flex-col gap-6
                  rounded-2xl p-8
                  border border-white/10 bg-gray-900
                  transition-all duration-500
                  hover:border-cyan-400/30
                  hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]
                "
              >
                <h1 className="bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-4xl font-semibold text-transparent">
                  {item.title}
                </h1>
                <p className="text-base font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsComponenet />

      {/* Learning + Contact */}
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col gap-16">
        <LearningGrid />
        <ContactFormSection />
      </section>

      {/* Reviews */}
      <div
        className="
          relative mx-auto my-20
          flex w-11/12 max-w-maxContent flex-col items-center gap-8
          rounded-2xl bg-gray-900 p-8
          border border-white/10
          transition-all duration-500
          hover:border-cyan-400/30
          hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]
        "
      >
        <h1 className="text-center text-4xl font-semibold">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  )
}

export default About
