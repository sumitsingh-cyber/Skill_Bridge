import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints

// =====================================================
// ================= STUDENT ===========================
// =====================================================

export const getAllCourses = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) throw new Error("Failed to fetch courses")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const fetchCourseDetails = async (courseId) => {
  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId })
    if (!response?.data?.success) throw new Error(response.data.message)
    result = response.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    if (!response?.data?.success) throw new Error("Failed to fetch categories")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

// 🔥 FIXED FUNCTION (MOST IMPORTANT)
export const getFullDetailsOfCourse = async (courseId) => {
  const toastId = toast.loading("Loading course...")
  let result = null

  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch course")
    }

    // ✅ NORMALIZE RESPONSE FOR ViewCourse.jsx
    result = {
      courseDetails: response.data.data.courseDetails || response.data.data,
      completedVideos: response.data.data.completedVideos || [],
    }
  } catch (error) {
    toast.error(error.message)
  }

  toast.dismiss(toastId)
  return result
}

export const markLectureAsComplete = async (data) => {
  let success = false
  try {
    const response = await apiConnector(
      "POST",
      LECTURE_COMPLETION_API,
      data
    )
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Lecture Completed")
    success = true
  } catch (error) {
    toast.error(error.message)
  }
  return success
}

export const createRating = async (data) => {
  let success = false
  try {
    const response = await apiConnector(
      "POST",
      CREATE_RATING_API,
      data
    )
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Rating Created")
    success = true
  } catch (error) {
    toast.error(error.message)
  }
  return success
}

// =====================================================
// ================= INSTRUCTOR ========================
// =====================================================

export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Creating Course...")
  try {
    const response = await apiConnector(
      "POST",
      CREATE_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message || "Create failed")
    toast.success("Course Created")
    result = response.data.data
  } catch (error) {
    console.error("CREATE COURSE API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to create course")
  }
  toast.dismiss(toastId)
  return result
}

export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Updating Course...")
  try {
    const response = await apiConnector(
      "PUT",
      EDIT_COURSE_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message || "Update failed")
    toast.success("Course Updated")
    result = response.data.data
  } catch (error) {
    console.error("EDIT COURSE API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to update course")
  }
  toast.dismiss(toastId)
  return result
}

export const fetchInstructorCourses = async () => {
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API
    )
    if (!response?.data?.success) throw new Error("Fetch failed")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const deleteCourse = async (courseId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_COURSE_API}/${courseId}`
    )
    toast.success("Course Deleted")
    return response.data
  } catch (error) {
    toast.error(error.message)
    throw error
  }
}

// =====================================================
// ================= SECTION ============================
// =====================================================

export const createSection = async (data) => {
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data)
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Section Created")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const updateSection = async (data) => {
  let result = null
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data)
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Section Updated")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const deleteSection = async (data) => {
  let result = null
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data)
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Section Deleted")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

// =====================================================
// ================= SUB SECTION ========================
// =====================================================

export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Uploading lecture video...")
  try {
    const response = await apiConnector(
      "POST",
      CREATE_SUBSECTION_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message || "Failed")
    toast.success("Lecture Added")
    result = response.data.data
  } catch (error) {
    console.error("CREATE SUBSECTION ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to add lecture")
  }
  toast.dismiss(toastId)
  return result
}

export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Updating lecture...")
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_SUBSECTION_API,
      data,
      {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message || "Failed")
    toast.success("Lecture Updated")
    result = response.data.data
  } catch (error) {
    console.error("UPDATE SUBSECTION ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to update lecture")
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSubSection = async (data) => {
  let result = null
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_SUBSECTION_API,
      data
    )
    if (!response?.data?.success) throw new Error("Failed")
    toast.success("Lecture Deleted")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}
