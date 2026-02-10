import React from "react"

const Stats = [
  { count: "5K+", label: "Active Students" },
  { count: "10+", label: "Expert Mentors" },
  { count: "200+", label: "Courses Available" },
  { count: "50+", label: "Global Awards" },
]

const StatsComponenet = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="mx-auto w-11/12 max-w-maxContent">
        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {Stats.map((stat, index) => (
            <div
              key={index}
              className="
                group relative overflow-hidden
                rounded-2xl bg-gray-800
                border border-white/10
                px-6 py-10 text-center

                transition-all duration-500
                hover:-translate-y-2
                hover:border-cyan-400/30
                hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]
              "
            >
              {/* Glow background */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-linear-to-br from-cyan-400/10 via-blue-500/10 to-indigo-500/10
                  opacity-0 blur-2xl
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
              />

              {/* Content */}
              <h1
                className="
                  relative z-10 text-3xl font-extrabold
                  text-white tracking-tight
                "
              >
                {stat.count}
              </h1>

              <p
                className="
                  relative z-10 mt-2 text-sm font-medium
                  text-gray-400
                  group-hover:text-gray-300
                  transition-colors
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsComponenet
