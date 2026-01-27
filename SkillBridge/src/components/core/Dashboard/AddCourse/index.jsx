import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <>
      <div className="flex w-full items-start gap-x-6">
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-semibold text-gray-100">
            Add Course
          </h1>

          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>

        {/* Course Upload Tips */}
        <div
          className="sticky top-10 hidden max-w-100 flex-1
                     rounded-xl border border-gray-700 bg-gray-900 p-6
                     xl:block
                     transition-all duration-300 ease-in-out
                     hover:border-gray-500 hover:shadow-xl hover:-translate-y-1"
        >
          <p
            className="mb-8 text-lg font-medium text-gray-100
                       transition-colors duration-300
                       group-hover:text-white"
          >
            ⚡ Course Upload Tips
          </p>

          <ul className="ml-5 list-disc space-y-4 text-xs text-gray-300">
            <li className="transition-colors duration-200 hover:text-gray-100">
              Set the Course Price option or make it free.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Standard size for the course thumbnail is 1024×576.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Video section controls the course overview video.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Course Builder is where you create & organize a course.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Make announcements to notify any important updates.
            </li>
            <li className="transition-colors duration-200 hover:text-gray-100">
              Notes to all enrolled students at once.
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
