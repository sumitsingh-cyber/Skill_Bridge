import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadCourse = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)

      if (result && isMounted) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result))
        dispatch(setStep(1))
      }

      if (isMounted) setLoading(false)
    }

    loadCourse()

    return () => {
      isMounted = false
    }
  }, [courseId, token, dispatch])

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent shadow-[0_0_25px_rgba(250,204,21,0.7)]"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <h1 className="mb-10 text-3xl font-semibold text-gray-100 transition-all duration-300 hover:text-yellow-400 hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">
        Edit Course
      </h1>

      <div className="mx-auto max-w-175 rounded-xl bg-richblack-800 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-2xl font-semibold text-gray-400 transition-all duration-300 hover:text-red-400 hover:drop-shadow-[0_0_10px_rgba(248,113,113,0.6)]">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}
