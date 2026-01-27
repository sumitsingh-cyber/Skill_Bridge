import React from "react"
import HighlightText from "../HomePage/Highlight"
import CTAButton from "../HomePage/CTAButton"

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "SkillBridge partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The curriculum is designed to match real-world industry demands.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Interactive lessons, projects, and mentorship to ensure deep understanding.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Earn globally recognized certificates to showcase your skills.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Instant feedback with automated grading and performance tracking.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Hands-on experience to prepare you for real job challenges.",
  },
]

const LearningGrid = () => {
  return (
    <div className="mx-auto mb-12 grid w-87.5 grid-cols-1 gap-6 xl:w-fit xl:grid-cols-4">
      {LearningGridArray.map((card, i) => {
        const isHero = card.order < 0

        return (
          <div
            key={i}
            className={`
              ${i === 0 ? "xl:col-span-2 xl:h-75" : "h-75"}
              ${card.order === 3 ? "xl:col-start-2" : ""}

              rounded-2xl bg-gray-900
              border border-white/10

              transition-all duration-500
              hover:-translate-y-2
              hover:border-cyan-400/30
              hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]
            `}
          >
            {isHero ? (
              <div className="flex h-full flex-col gap-4 p-8">
                <h1 className="text-3xl font-semibold text-gray-100">
                  {card.heading}{" "}
                  <HighlightText text={card.highlightText} />
                </h1>

                <p className="text-gray-400 font-medium">
                  {card.description}
                </p>

                <div className="mt-4 w-fit">
                  <CTAButton active linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col gap-4 p-8">
                <h1 className="text-lg font-semibold text-gray-100">
                  {card.heading}
                </h1>

                <p className="text-gray-400 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default LearningGrid
