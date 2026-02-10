import Course_Card from "./Course_Card"

const CourseSlider = ({ Courses }) => {
  if (!Array.isArray(Courses) || Courses.length === 0) {
    return <p className="text-xl text-gray-200">No Course Found</p>
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 pb-4">
        {Courses.map((course) => (
          <div
            key={course._id}
            className="min-w-75 shrink-0"
          >
            <Course_Card course={course} Height="h-[250px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseSlider
