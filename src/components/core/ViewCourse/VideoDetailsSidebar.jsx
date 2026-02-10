import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <>
     <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-87.5 flex-col border-r border-gray-800 bg-gray-900">
  
  {/* Header */}
  <div className="mx-5 flex flex-col gap-4 border-b border-gray-700 py-5 text-lg font-bold text-gray-100">
    <div className="flex w-full items-center justify-between">
      <div
        onClick={() => navigate(`/dashboard/enrolled-courses`)}
        className="flex h-8.75 w-8.75 items-center justify-center rounded-full bg-gray-200 p-1 text-gray-700 hover:scale-90"
        title="back"
      >
        <IoIosArrowBack size={30} />
      </div>

      <IconBtn
        text="Add Review"
        customClasses="ml-auto"
        onclick={() => setReviewModal(true)}
      />
    </div>

    <div>
      <p>{courseEntireData?.courseName}</p>
      <p className="text-sm font-semibold text-gray-400">
        {completedLectures?.length} / {totalNoOfLectures}
      </p>
    </div>
  </div>

  {/* Sections */}
  <div className="h-[calc(100vh-5rem)] overflow-y-auto">
    {courseSectionData.map((course, index) => (
      <div
        key={index}
        className="mt-2 cursor-pointer text-sm text-gray-200"
        onClick={() => setActiveStatus(course?._id)}
      >
        {/* Section Header */}
        <div className="flex justify-between bg-gray-800 px-5 py-4">
          <div className="w-[70%] font-semibold">
            {course?.sectionName}
          </div>
          <span
            className={`${
              activeStatus === course?._id ? "rotate-0" : "rotate-180"
            } transition-all duration-500`}
          >
            <BsChevronDown />
          </span>
        </div>

        {/* Sub Sections */}
        {activeStatus === course?._id && (
          <div>
            {course.subSection.map((topic, i) => (
              <div
                key={i}
                className={`flex gap-3 px-5 py-2 ${
                  videoBarActive === topic._id
                    ? "bg-yellow-200 text-gray-900 font-semibold"
                    : "hover:bg-gray-950"
                }`}
                onClick={() => {
                  navigate(
                    `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                  )
                  setVideoBarActive(topic._id)
                }}
              >
                <input
                  type="checkbox"
                  checked={completedLectures.includes(topic?._id)}
                  readOnly
                />
                {topic.title}
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

    </>
  )
}