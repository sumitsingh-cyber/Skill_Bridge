import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)

  // ✅ Pre-fill checkbox if already published
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [course, setValue])

  // ⬅️ Back to Course Builder (step 2)
  const goBack = () => {
    dispatch(setStep(2))
  }

  // 🚀 Go to My Courses
  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  // 📤 Publish / Save
  const handleCoursePublish = async () => {
    const isPublic = getValues("public")

    // ✅ No change → just redirect
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && isPublic) ||
      (course?.status === COURSE_STATUS.DRAFT && !isPublic)
    ) {
      goToCourses()
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    formData.append(
      "status",
      isPublic ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
    )

    setLoading(true)
    const result = await editCourseDetails(formData, token)
    setLoading(false)

    if (result) {
      goToCourses()
    }
  }

  return (
    <div
      className="rounded-xl border border-gray-700 bg-gray-900 p-6
                 transition-all duration-300 ease-in-out
                 hover:border-gray-500 hover:shadow-xl"
    >
      <p className="text-2xl font-semibold text-gray-100 mb-6">
        Publish Settings
      </p>

      <form onSubmit={handleSubmit(handleCoursePublish)}>
        {/* Checkbox */}
        <div className="mb-10">
          <label
            htmlFor="public"
            className="flex items-center gap-3 text-lg text-gray-300
                       cursor-pointer select-none
                       transition-colors duration-200
                       hover:text-gray-100"
          >
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800
                         text-yellow-400
                         focus:ring-2 focus:ring-yellow-400
                         transition-all duration-200"
            />
            <span>Make this course public</span>
          </label>
        </div>

        {/* Actions */}
        <div className="ml-auto flex max-w-max items-center gap-4">
          {/* Back */}
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="rounded-md bg-gray-700 px-6 py-2
                       font-semibold text-gray-100
                       transition-all duration-200
                       hover:bg-gray-600 hover:scale-105
                       active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {/* Save */}
          <IconBtn
            type="submit"
            disabled={loading}
            text={loading ? "Saving..." : "Save Changes"}
            customClasses="hover:scale-105 active:scale-95"
          />
        </div>
      </form>
    </div>
  )
}
