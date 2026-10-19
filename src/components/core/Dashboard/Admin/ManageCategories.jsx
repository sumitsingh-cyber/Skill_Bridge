import { useEffect, useState } from "react"
import { FiPlus, FiTrash2, FiLayers, FiFolderPlus, FiX } from "react-icons/fi"
import {
  createNewCategory,
  deletePlatformCategory,
} from "../../../../services/operations/adminAPI"
import { apiConnector } from "../../../../services/apiconnector"
import { categories as categoryEndpoints } from "../../../../services/apis"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await apiConnector("GET", categoryEndpoints.CATEGORIES_API)
      if (res?.data?.data) {
        setCategories(res.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) return

    setIsSubmitting(true)
    const success = await createNewCategory(formData.name.trim(), formData.description.trim())
    if (success) {
      setFormData({ name: "", description: "" })
      setShowAddModal(false)
      fetchCategories()
    }
    setIsSubmitting(false)
  }

  const handleDeleteCategory = async (categoryId) => {
    const success = await deletePlatformCategory(categoryId)
    if (success) {
      fetchCategories()
    }
    setConfirmationModal(null)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Course Categories</h1>
          <p className="mt-1 text-sm text-gray-400">
            Create, inspect, and organize learning domains on SkillBridge.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-yellow-300 shadow-lg shadow-yellow-500/20 active:scale-95"
        >
          <FiPlus className="text-lg" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid min-h-60 place-items-center">
          <div className="spinner"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 py-16 text-center">
          <FiLayers className="mx-auto text-4xl text-gray-600" />
          <p className="mt-3 text-lg font-medium text-gray-300">No categories found</p>
          <p className="text-sm text-gray-500">Create the first category to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20">
                    <FiLayers className="text-xl" />
                  </div>

                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete Category?",
                        text2: `Are you sure you want to delete "${cat.name}"? This action cannot be undone.`,
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteCategory(cat._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Delete Category"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-100">{cat.name}</h3>
                <p className="mt-2 text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {cat.description || "No description provided for this category."}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-800/80 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Category ID</span>
                <span className="font-mono text-gray-400">{cat._id?.slice(-8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <FiFolderPlus className="text-xl" />
                <h3 className="text-lg font-bold text-gray-100">Create New Category</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Category Name <sup className="text-red-400">*</sup>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Web Development, Cloud Computing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-sm text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">
                  Category Description <sup className="text-red-400">*</sup>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a clear, engaging overview of what learners will study in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 p-3 text-sm text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}
