import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { adminEndpoints } from "../apis"

const {
  GET_ADMIN_DASHBOARD_API,
  GET_ALL_USERS_API,
  UPDATE_USER_ROLE_API,
  DELETE_USER_API,
  GET_ALL_COURSES_API,
  UPDATE_COURSE_STATUS_API,
  CREATE_CATEGORY_API,
  DELETE_CATEGORY_API,
} = adminEndpoints

export const getAdminDashboardData = async () => {
  let result = null
  try {
    const response = await apiConnector("GET", GET_ADMIN_DASHBOARD_API)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch admin dashboard")
    }
    result = response.data.data
  } catch (error) {
    console.error("ADMIN DASHBOARD API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to load dashboard")
  }
  return result
}

export const getAllPlatformUsers = async (role = "All") => {
  let result = []
  try {
    const url = role && role !== "All" ? `${GET_ALL_USERS_API}?role=${role}` : GET_ALL_USERS_API
    const response = await apiConnector("GET", url)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch users")
    }
    result = response.data.data
  } catch (error) {
    console.error("GET ALL USERS API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to load users")
  }
  return result
}

export const updateUserRole = async (userId, newRole) => {
  const toastId = toast.loading("Updating role...")
  let success = false
  try {
    const response = await apiConnector("PUT", UPDATE_USER_ROLE_API, {
      userId,
      newRole,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not update user role")
    }
    toast.success(response.data.message || "Role updated successfully")
    success = true
  } catch (error) {
    console.error("UPDATE USER ROLE API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to update role")
  }
  toast.dismiss(toastId)
  return success
}

export const deletePlatformUser = async (userId) => {
  const toastId = toast.loading("Deleting user...")
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_USER_API}/${userId}`)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete user")
    }
    toast.success(response.data.message || "User deleted successfully")
    success = true
  } catch (error) {
    console.error("DELETE USER API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to delete user")
  }
  toast.dismiss(toastId)
  return success
}

export const getAllPlatformCourses = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch courses")
    }
    result = response.data.data
  } catch (error) {
    console.error("GET ALL PLATFORM COURSES API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to load courses")
  }
  return result
}

export const updatePlatformCourseStatus = async (courseId, status) => {
  const toastId = toast.loading("Updating course status...")
  let success = false
  try {
    const response = await apiConnector("PUT", UPDATE_COURSE_STATUS_API, {
      courseId,
      status,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not update course status")
    }
    toast.success(response.data.message || "Status updated")
    success = true
  } catch (error) {
    console.error("UPDATE COURSE STATUS API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to update status")
  }
  toast.dismiss(toastId)
  return success
}

export const createNewCategory = async (name, description) => {
  const toastId = toast.loading("Creating category...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, {
      name,
      description,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not create category")
    }
    toast.success("Category created successfully")
    success = true
  } catch (error) {
    console.error("CREATE CATEGORY API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to create category")
  }
  toast.dismiss(toastId)
  return success
}

export const deletePlatformCategory = async (categoryId) => {
  const toastId = toast.loading("Deleting category...")
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_CATEGORY_API}/${categoryId}`)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete category")
    }
    toast.success("Category deleted successfully")
    success = true
  } catch (error) {
    console.error("DELETE CATEGORY API ERROR:", error)
    toast.error(error?.response?.data?.message || error.message || "Failed to delete category")
  }
  toast.dismiss(toastId)
  return success
}
