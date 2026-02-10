import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, useNavigate } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"

import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    if (!token || !courseId) return

    const fetchCourse = async () => {
      const courseData = await getFullDetailsOfCourse(courseId)

      if (!courseData || !courseData.courseDetails) {
        console.error("❌ Course data not available")
        return
      }

      const courseContent = courseData.courseDetails.courseContent

      dispatch(setCourseSectionData(courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos || []))

      let lectures = 0
      courseContent.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))

      // ▶️ Auto open first video
      const firstSection = courseContent?.[0]
      const firstSubSection = firstSection?.subSection?.[0]

      if (firstSection && firstSubSection) {
        navigate(
          `/view-course/${courseId}/section/${firstSection._id}/sub-section/${firstSubSection._id}`,
          { replace: true }
        )
      }
    }

    fetchCourse()
  }, [courseId, token, dispatch, navigate])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
