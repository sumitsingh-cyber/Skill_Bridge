import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // ================= Guards =================
  if (!course || !Array.isArray(course.courseContent)) {
    return (
      <div className="rounded-xl bg-gray-900 p-6 text-center text-gray-400">
        No course content available
      </div>
    )
  }

  // ================= Handlers =================
  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    )

    if (result) dispatch(setCourse(result))
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection(
      { subSectionId, sectionId },
      token
    )

    if (result) dispatch(setCourse(result))
    setConfirmationModal(null)
  }

  // ================= Render =================
  return (
    <>
      <div
        id="nestedViewContainer"
        className="rounded-xl bg-gray-900 p-6 px-8
                   transition-all duration-300 hover:shadow-lg"
      >
        {course.courseContent.map((section) => (
          <details
            key={section._id}
            open
            className="group rounded-lg transition-all duration-200"
          >
            {/* Section Header */}
            <summary
              className="flex cursor-pointer items-center justify-between
                         border-b border-gray-700 py-3
                         transition-colors duration-200
                         hover:bg-gray-800"
            >
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-gray-300" />
                <p className="font-semibold text-gray-100">
                  {section.sectionName}
                </p>
              </div>

              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                  className="transition-all duration-200
                             hover:text-yellow-400 hover:scale-110"
                >
                  <MdEdit className="text-xl text-gray-400" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () =>
                        handleDeleleSection(section._id),
                      btn2Handler: () =>
                        setConfirmationModal(null),
                    })
                  }
                  className="transition-all duration-200
                             hover:text-red-400 hover:scale-110"
                >
                  <RiDeleteBin6Line className="text-xl text-gray-400" />
                </button>

                <span className="text-gray-600">|</span>

                <AiFillCaretDown
                  className="text-xl text-gray-400
                             transition-transform duration-300
                             group-open:rotate-180"
                />
              </div>
            </summary>

            {/* Sub Sections */}
            <div className="px-6 pb-4">
              {(section?.subSection || []).map((data) => (
                <div
                  key={data._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between
                             gap-x-3 border-b border-gray-700 py-3
                             transition-colors duration-200
                             hover:bg-gray-800"
                >
                  <div className="flex items-center gap-x-3">
                    <RxDropdownMenu className="text-2xl text-gray-300" />
                    <p className="font-medium text-gray-100">
                      {data.title}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({
                          ...data,
                          sectionId: section._id,
                        })
                      }
                      className="transition-all duration-200
                                 hover:text-yellow-400 hover:scale-110"
                    >
                      <MdEdit className="text-xl text-gray-400" />
                    </button>

                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(
                              data._id,
                              section._id
                            ),
                          btn2Handler: () =>
                            setConfirmationModal(null),
                        })
                      }
                      className="transition-all duration-200
                                 hover:text-red-400 hover:scale-110"
                    >
                      <RiDeleteBin6Line className="text-xl text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Lecture */}
              <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-4 flex items-center gap-x-2
                           text-sm font-semibold text-yellow-400
                           transition-all duration-200
                           hover:text-yellow-300 hover:translate-x-1"
              >
                <FaPlus className="text-sm" />
                <span>Add Lecture</span>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* SubSection Modal */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit
        />
      ) : null}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
