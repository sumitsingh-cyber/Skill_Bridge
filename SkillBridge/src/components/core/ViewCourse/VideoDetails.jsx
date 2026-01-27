import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // ================= LOAD VIDEO =================
  useEffect(() => {
    if (!courseSectionData?.length) return

    const section = courseSectionData.find(
      (sec) => sec._id === sectionId
    )

    const subSection = section?.subSection?.find(
      (sub) => sub._id === subSectionId
    )

    if (!subSection) return

    setVideoData(subSection)
    setVideoEnded(false)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [courseSectionData, sectionId, subSectionId, location.pathname])

  // ================= NAV HELPERS =================
  const isFirstVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      courseSectionData[secIndex]?.subSection.findIndex(
        (sub) => sub._id === subSectionId
      )
    return secIndex === 0 && subIndex === 0
  }

  const isLastVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      courseSectionData[secIndex]?.subSection.findIndex(
        (sub) => sub._id === subSectionId
      )
    return (
      secIndex === courseSectionData.length - 1 &&
      subIndex ===
        courseSectionData[secIndex].subSection.length - 1
    )
  }

  const goToNextVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      courseSectionData[secIndex].subSection.findIndex(
        (sub) => sub._id === subSectionId
      )

    if (subIndex < courseSectionData[secIndex].subSection.length - 1) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${
          courseSectionData[secIndex].subSection[subIndex + 1]._id
        }`
      )
    } else {
      const nextSection = courseSectionData[secIndex + 1]
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  const goToPrevVideo = () => {
    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    )
    const subIndex =
      courseSectionData[secIndex].subSection.findIndex(
        (sub) => sub._id === subSectionId
      )

    if (subIndex > 0) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${
          courseSectionData[secIndex].subSection[subIndex - 1]._id
        }`
      )
    } else {
      const prevSection = courseSectionData[secIndex - 1]
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${
          prevSection.subSection[prevSection.subSection.length - 1]._id
        }`
      )
    }
  }

  // ================= COMPLETE LECTURE =================
  const handleLectureCompletion = async () => {
    setLoading(true)
    const success = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    )
    if (success) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  // ================= UI =================
  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData?.videoUrl ? (
        <img
          src={courseEntireData?.thumbnail}
          alt="Course Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            controls
            className="w-full rounded-lg"
            src={videoData.videoUrl}
            onEnded={() => setVideoEnded(true)}
          />

          {videoEnded && (
            <div className="absolute inset-0 grid place-content-center bg-black/70">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={handleLectureCompletion}
                  text={loading ? "Loading..." : "Mark As Completed"}
                />
              )}

              <IconBtn
                text="Rewatch"
                customClasses="mt-3"
                onclick={() => {
                  videoRef.current.currentTime = 0
                  videoRef.current.play()
                  setVideoEnded(false)
                }}
              />

              <div className="mt-6 flex gap-4">
                {!isFirstVideo() && (
                  <button onClick={goToPrevVideo} className="blackButton">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button onClick={goToNextVideo} className="blackButton">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails
