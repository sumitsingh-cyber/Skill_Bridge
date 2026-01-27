import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import Footer from "../components/common/Footer"
import Error from "./Error"

import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { getCatalogaPageData } from "../services/operations/pageAndComponentData"

import Course_Card from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/CourseSlider"

const Catalog = () => {
  const { catalogName } = useParams()
  const { loading } = useSelector((state) => state.profile)

  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState(null)

  // ================= FETCH CATEGORY ID =================
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API)

      const matchedCategory = res?.data?.data?.find(
        (ct) =>
          ct.name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-") === catalogName
      )

      if (matchedCategory) {
        setCategoryId(matchedCategory._id)
      }
    }

    getCategories()
  }, [catalogName])

  // ================= FETCH CATALOG DATA =================
  useEffect(() => {
    const getCategoryDetails = async () => {
      const res = await getCatalogaPageData(categoryId)
      setCatalogPageData(res)
    }

    if (categoryId) getCategoryDetails()
  }, [categoryId])

  // ================= LOADING =================
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!catalogPageData.success) {
    return <Error />
  }

  const { selectedCategory, differentCategory, mostSellingCourses } =
    catalogPageData.data

  const selectedCourses = selectedCategory?.courses || []
  const differentCourses = differentCategory?.courses || []

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="bg-richblack-800 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 blur-3xl bg-linear-to-r from-yellow-200 via-purple-500 to-pink-500"></div>

        <div className="relative mx-auto flex min-h-65 max-w-maxContent flex-col justify-center gap-4">
          <p className="text-sm text-gray-300">
            Home / Catalog /{" "}
            <span className="text-yellow-200">
              {selectedCategory?.name}
            </span>
          </p>

          <h1 className="text-3xl font-semibold text-gray-50">
            {selectedCategory?.name}
          </h1>

          <p className="max-w-217.5 text-gray-200">
            {selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* ================= SECTION 1 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-12">
        <div className="section_heading">Courses to get you started</div>

        <div className="my-4 flex border-b border-gray-600 text-sm">
          {["Most Popular", "New"].map((label, index) => (
            <button
              key={label}
              onClick={() => setActive(index + 1)}
              className={`px-4 py-2 ${
                active === index + 1
                  ? "text-yellow-50 border-b-2 border-yellow-50"
                  : "text-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {selectedCourses.length > 0 ? (
          <CourseSlider Courses={selectedCourses} />
        ) : (
          <p className="text-gray-400 mt-4">No courses found.</p>
        )}
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-12">
        <div className="section_heading">
          Top courses in {differentCategory?.name}
        </div>

        {differentCourses.length > 0 ? (
          <CourseSlider Courses={differentCourses} />
        ) : (
          <p className="text-gray-400 mt-4">No courses found.</p>
        )}
      </div>

      {/* ================= SECTION 3 ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-12">
        <div className="section_heading">Frequently Bought</div>

        <div className="py-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {mostSellingCourses?.slice(0, 4)?.map((course, i) => (
            <Course_Card key={i} course={course} Height="h-[400px]" />
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Catalog
