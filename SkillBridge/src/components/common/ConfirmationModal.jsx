import { useEffect } from "react"
import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  // Safety guard
  if (!modalData) return null

  const {
    text1,
    text2,
    btn1Text,
    btn2Text,
    btn1Handler,
    btn2Handler,
  } = modalData

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        btn2Handler()
      }
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [btn2Handler])

  return (
    <div
      className="
        fixed inset-0 z-1000
        grid place-items-center
        bg-black/40 backdrop-blur-sm
        px-4
      "
      onClick={btn2Handler}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-sm
          rounded-2xl
          bg-gray-800
          border border-gray-700
          p-6

          shadow-xl shadow-black/50
          transition-all duration-300
          animate-scaleIn
        "
      >
        <h2 className="text-2xl font-semibold text-gray-100">
          {text1}
        </h2>

        <p className="mt-3 mb-6 text-gray-300 leading-relaxed">
          {text2}
        </p>

        <div className="flex items-center gap-4">
          <IconBtn
            onClick={btn1Handler}
            text={btn1Text}
          />

          <button
            onClick={btn2Handler}
            className="
              rounded-lg
              bg-gray-200
              px-5 py-2
              font-semibold text-gray-900

              transition-all duration-300
              hover:bg-white
              active:scale-95
            "
          >
            {btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}
