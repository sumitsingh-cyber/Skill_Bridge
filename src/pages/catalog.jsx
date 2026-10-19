import React, { useEffect, useState, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { FiChevronRight, FiTrendingUp, FiBookOpen, FiAward } from "react-icons/fi"
import { HiOutlineSparkles } from "react-icons/hi"

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

  const [activeTab, setActiveTab] = useState("popular")
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState(null)

  // ================= FETCH CATEGORY ID =================
  useEffect(() => {
    const getCategories = async () => {
      try {
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
      } catch (err) {
        console.error("Failed to load categories for catalog:", err)
      }
    }

    getCategories()
  }, [catalogName])

  // ================= FETCH CATALOG DATA =================
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogaPageData(categoryId)
        setCatalogPageData(res)
      } catch (err) {
        console.error("Failed to load category page data:", err)
      }
    }

    if (categoryId) getCategoryDetails()
  }, [categoryId])

  // ================= COMPUTED SORTED COURSES =================
  const { selectedCategory, differentCategory, mostSellingCourses } =
    catalogPageData?.data || {}

  const rawCourses = selectedCategory?.courses || []

  const sortedCourses = useMemo(() => {
    if (!rawCourses || rawCourses.length === 0) return []
    const list = [...rawCourses]
    if (activeTab === "popular") {
      return list.sort((a, b) => {
        const countA = Array.isArray(a.studentsEnrolled) ? a.studentsEnrolled.length : 0
        const countB = Array.isArray(b.studentsEnrolled) ? b.studentsEnrolled.length : 0
        return countB - countA
      })
    } else if (activeTab === "new") {
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
    return list
  }, [rawCourses, activeTab])

  const differentCourses = differentCategory?.courses || []

  // ================= LOADING STATE =================
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner"></div>
          <p className="text-sm text-richblack-400 font-medium">Loading catalog...</p>
        </div>
      </div>
    )
  }

  if (!catalogPageData.success) {
    return <Error />
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* ================= HERO BANNER ================= */}
      <div className="relative overflow-hidden border-b border-richblack-800 bg-richblack-800/80 px-4 py-12 md:py-16">
        {/* Ambient Glow Mesh */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-50/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-maxContent flex flex-col gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-richblack-300">
            <Link to="/" className="hover:text-yellow-50 transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} className="text-richblack-500" />
            <span className="text-richblack-400">Catalog</span>
            <FiChevronRight size={14} className="text-richblack-500" />
            <span className="font-semibold text-yellow-50">
              {selectedCategory?.name}
            </span>
          </nav>

          {/* Title & Badge */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-richblack-5">
              {selectedCategory?.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50/10 border border-yellow-50/20 px-3 py-1 text-xs font-semibold text-yellow-50">
              <HiOutlineSparkles size={14} />
              {rawCourses.length} {rawCourses.length === 1 ? "Course" : "Courses"}
            </span>
          </div>

          {/* Description */}
          <p className="max-w-3xl text-sm md:text-base text-richblack-200 leading-relaxed">
            {selectedCategory?.description ||
              `Master ${selectedCategory?.name} with comprehensive project-based courses curated by industry-leading instructors.`}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-richblack-300">
            <div className="flex items-center gap-1.5">
              <FiBookOpen className="text-yellow-50" size={15} />
              <span>Structured Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiAward className="text-yellow-50" size={15} />
              <span>Certificates on Completion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiTrendingUp className="text-yellow-50" size={15} />
              <span>Lifetime Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: COURSES TO GET STARTED ================= */}
      <div className="mx-auto w-full max-w-maxContent px-4 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-richblack-800 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">
              Courses to get you started
            </h2>
            <p className="text-xs md:text-sm text-richblack-400 mt-1">
              Top curated learning paths in {selectedCategory?.name}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center rounded-xl bg-richblack-800 p-1 border border-richblack-700/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("popular")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === "popular"
                  ? "bg-yellow-50 text-richblack-900 shadow-md"
                  : "text-richblack-200 hover:text-richblack-5"
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === "new"
                  ? "bg-yellow-50 text-richblack-900 shadow-md"
                  : "text-richblack-200 hover:text-richblack-5"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-yellow-50 text-richblack-900 shadow-md"
                  : "text-richblack-200 hover:text-richblack-5"
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="pt-6">
          <CourseSlider Courses={sortedCourses} />
        </div>
      </div>

      {/* ================= SECTION 2: OTHER TOP CATEGORY ================= */}
      {differentCategory && differentCourses.length > 0 && (
        <div className="mx-auto w-full max-w-maxContent px-4 py-8 md:py-12 border-t border-richblack-800">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">
              Top courses in{" "}
              <span className="text-yellow-50">{differentCategory?.name}</span>
            </h2>
            <p className="text-xs md:text-sm text-richblack-400 mt-1">
              Explore related skills and high-demand topics
            </p>
          </div>

          <CourseSlider Courses={differentCourses} />
        </div>
      )}

      {/* ================= SECTION 3: FREQUENTLY BOUGHT / POPULAR ================= */}
      {mostSellingCourses && mostSellingCourses.length > 0 && (
        <div className="mx-auto w-full max-w-maxContent px-4 py-12 md:py-16 border-t border-richblack-800">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-richblack-5">
              Frequently Bought & Trending
            </h2>
            <p className="text-xs md:text-sm text-richblack-400 mt-1">
              Popular courses loved by thousands of learners across SkillBridge
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mostSellingCourses.slice(0, 8).map((course) => (
              <Course_Card key={course._id} course={course} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Catalog
