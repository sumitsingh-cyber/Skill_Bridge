import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      setValue("title", modalData.title)
      setValue("description", modalData.description)
      setValue("video", modalData.videoUrl)
      setValue("timeDuration", modalData.timeDuration || "")
    }
  }, [])

  const isFormUpdated = () => {
    const v = getValues()
    return (
      v.title !== modalData.title ||
      v.description !== modalData.description ||
      v.video !== modalData.videoUrl ||
      v.timeDuration !== modalData.timeDuration
    )
  }

  const handleEditSubsection = async () => {
    const v = getValues()
    const formData = new FormData()

    formData.append("courseId", course._id)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)

    if (v.title !== modalData.title) formData.append("title", v.title)
    if (v.description !== modalData.description)
      formData.append("description", v.description)
    if (v.timeDuration !== modalData.timeDuration)
      formData.append("timeDuration", v.timeDuration)
    if (v.video !== modalData.videoUrl) formData.append("video", v.video)

    setLoading(true)
    const result = await updateSubSection(formData, token)

    if (result) {
      dispatch(setCourse(result)) // ✅ FIX
    }

    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id) // ✅ REQUIRED
    formData.append("sectionId", modalData)
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("timeDuration", data.timeDuration)
    formData.append("video", data.video)

    setLoading(true)
    const result = await createSubSection(formData, token)

    if (result) {
      dispatch(setCourse(result)) // ✅ FIX
    }

    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-1000
                    flex items-start justify-center
                    overflow-y-auto
                    bg-black bg-opacity-30 backdrop-blur-sm">

      <div className="my-10 w-11/12 max-w-175
                      max-h-[90vh] overflow-y-auto
                      rounded-lg border border-gray-600 bg-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between
                        bg-gray-700 p-5 rounded-t-lg sticky top-0 z-10">
          <p className="text-xl font-semibold text-gray-100">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-gray-100 hover:text-red-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8 py-8">
          <Upload
            name="video"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          <input
            placeholder="Lecture Title"
            {...register("title", { required: true })}
            disabled={view || loading}
            className="w-full rounded-md bg-gray-900 p-2 text-gray-100"
          />
          {errors.title && (
            <span className="text-xs text-pink-400">Title is required</span>
          )}

          <textarea
            placeholder="Lecture Description"
            {...register("description", { required: true })}
            disabled={view || loading}
            className="w-full min-h-30 rounded-md bg-gray-900 p-2 text-gray-100"
          />
          {errors.description && (
            <span className="text-xs text-pink-400">
              Description is required
            </span>
          )}

          <input
            placeholder="Duration (e.g. 10:30)"
            {...register("timeDuration", { required: true })}
            disabled={view || loading}
            className="w-full rounded-md bg-gray-900 p-2 text-gray-100"
          />
          {errors.timeDuration && (
            <span className="text-xs text-pink-400">
              Duration is required
            </span>
          )}

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
