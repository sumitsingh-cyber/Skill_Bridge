import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// ================= GET USER DETAILS =================
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector(
        "GET",
        GET_USER_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      console.log("GET_USER_DETAILS API RESPONSE 👉", response)

      if (!response?.data?.success || !response?.data?.data) {
        throw new Error("Invalid user details response")
      }

      const userData = response.data.data

      const userImage = userData.image
        ? userData.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`

      dispatch(setUser({ ...userData, image: userImage }))
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR 👉", error)
      dispatch(logout(navigate))
      toast.error("Could Not Get User Details")
    } finally {
      toast.dismiss(toastId)
      dispatch(setLoading(false))
    }
  }
}

// ================= GET USER ENROLLED COURSES =================
export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")

  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES")

    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES")
    console.log("RAW RESPONSE 👉", response)

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Failed to fetch enrolled courses"
      )
    }

    // 🔑 FINAL FIX — NORMALIZE EVERYTHING
    const enrolled = response?.data?.data ?? []

    const normalizedCourses = Array.isArray(enrolled)
      ? enrolled
      : enrolled
      ? [enrolled]
      : []

    console.log("✅ ENROLLED COURSES FINAL 👉", normalizedCourses)

    return normalizedCourses
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API ERROR 👉", error)
    toast.error("Could Not Get Enrolled Courses")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}

// ================= GET INSTRUCTOR DATA =================
export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("GET_INSTRUCTOR_API_RESPONSE 👉", response)

    if (!response?.data?.success) {
      throw new Error("Failed to fetch instructor data")
    }

    return Array.isArray(response?.data?.courses)
      ? response.data.courses
      : []
  } catch (error) {
    console.log("GET_INSTRUCTOR_API ERROR 👉", error)
    toast.error("Could not Get Instructor Data")
    return []
  } finally {
    toast.dismiss(toastId)
  }
}
