import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

export const getCatalogaPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = null

  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId }
    )

    if (!response?.data?.success) {
      throw new Error("Failed to fetch catalog data")
    }

    result = response.data
  } catch (error) {
    toast.error(error.message)
    result = null
  }

  toast.dismiss(toastId)
  return result
}
