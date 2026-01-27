import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      setCourseCategories(categories || [])
      setLoading(false)
    }

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category?._id)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }

    getCategories()
  }, [])

  /* ---------------- FORM UPDATE CHECK ---------------- */
  const isFormUpdated = () => {
    const v = getValues()
    return (
      v.courseTitle !== course.courseName ||
      v.courseShortDesc !== course.courseDescription ||
      v.coursePrice !== course.price ||
      v.courseTags?.toString() !== course.tag.toString() ||
      v.courseBenefits !== course.whatYouWillLearn ||
      v.courseCategory !== course.category._id ||
      v.courseRequirements?.toString() !== course.instructions.toString() ||
      v.courseImage !== course.thumbnail
    )
  }

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      setLoading(true)

      if (editCourse) {
        if (!isFormUpdated()) {
          toast.error("No changes made")
          return
        }

        const formData = new FormData()
        formData.append("courseId", course._id)
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append(
          "instructions",
          JSON.stringify(data.courseRequirements)
        )

        if (data.courseImage instanceof File) {
          formData.append("thumbnailImage", data.courseImage)
        }

        const result = await editCourseDetails(formData, token)
        if (result) {
          dispatch(setCourse(result))
          dispatch(setStep(2))
        }
        return
      }

      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append(
        "instructions",
        JSON.stringify(data.courseRequirements)
      )
      formData.append("thumbnailImage", data.courseImage)

      const result = await addCourseDetails(formData, token)
      if (result) {
        dispatch(setCourse(result))
        dispatch(setStep(2))
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        space-y-8 rounded-xl border border-gray-700 bg-gray-900 p-6
        transition-all duration-300 ease-out
        hover:border-gray-600 hover:shadow-lg hover:shadow-black/40
      "
    >
      {/* COURSE TITLE */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-100">
          Course Title <sup className="text-pink-400">*</sup>
        </label>
        <input
          {...register("courseTitle", { required: true })}
          placeholder="Enter Course Title"
          className="
            w-full rounded-md bg-gray-800 px-3 py-2 text-gray-100
            outline-none placeholder-gray-400
            transition-all duration-200
            focus:ring-2 focus:ring-yellow-400/40 focus:scale-[1.01]
          "
        />
        {errors.courseTitle && (
          <span className="text-xs text-pink-400">
            Course title is required
          </span>
        )}
      </div>

      {/* SHORT DESCRIPTION */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-100">
          Course Short Description <sup className="text-pink-400">*</sup>
        </label>
        <textarea
          {...register("courseShortDesc", { required: true })}
          placeholder="Enter Description"
          className="
            min-h-32.5 rounded-md bg-gray-800 px-3 py-2 text-gray-100
            outline-none placeholder-gray-400
            transition-all duration-200
            focus:ring-2 focus:ring-yellow-400/40
          "
        />
      </div>

      {/* PRICE */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-100">
          Course Price <sup className="text-pink-400">*</sup>
        </label>
        <div className="relative">
          <input
            {...register("coursePrice", { required: true, valueAsNumber: true })}
            placeholder="Enter Course Price"
            className="
              w-full rounded-md bg-gray-800 px-12 py-2 text-gray-100
              outline-none transition-all duration-200
              focus:ring-2 focus:ring-yellow-400/40
            "
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-gray-100">
          Course Category <sup className="text-pink-400">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          className="
            rounded-md bg-gray-800 px-3 py-2 text-gray-100
            outline-none transition-all duration-200
            hover:bg-gray-700 focus:ring-2 focus:ring-yellow-400/40
          "
        >
          <option value="">Choose a Category</option>
          {courseCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course.thumbnail : null}
      />

      <div className="flex justify-end gap-3">
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
          customClasses="transition-all duration-300 hover:scale-[1.02]"
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
