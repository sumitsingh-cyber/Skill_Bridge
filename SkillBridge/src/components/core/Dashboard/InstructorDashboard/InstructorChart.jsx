import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function InstructorChart({ courses = [] }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [mode, setMode] = useState("students")

  useEffect(() => {
    if (!canvasRef.current || courses.length === 0) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const labels = courses.map(c => c.courseName)

    const data =
      mode === "students"
        ? courses.map(c => c.studentsEnrolled?.length || 0)
        : courses.map(c => (c.studentsEnrolled?.length || 0) * c.price)

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#FACC15",
              "#60A5FA",
              "#34D399",
              "#F87171",
              "#A78BFA",
              "#FB923C",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
             maintainAspectRatio: false, 
                radius: "20%",          
                cutout: "25%", 
            labels: {
              color: "#E5E7EB",
            },
          },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [courses, mode])

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gray-900 p-6">
      <p className="text-lg font-semibold text-gray-100">Visualize</p>

      <div className="flex gap-3">
        <button
          onClick={() => setMode("students")}
          className={`px-4 py-1 rounded ${
            mode === "students"
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setMode("income")}
          className={`px-4 py-1 rounded ${
            mode === "income"
              ? "bg-yellow-400 text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Income
        </button>
      </div>

      <canvas ref={canvasRef} />
    </div>
  )
}
