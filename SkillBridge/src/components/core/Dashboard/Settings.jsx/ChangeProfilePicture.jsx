import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI.js"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const handleFileUpload = () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      dispatch(updateDisplayPicture(token, formData)).finally(() =>
        setLoading(false)
      )
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (imageFile) previewFile(imageFile)
  }, [imageFile])

  return (
    <div className="
      flex items-center justify-between
      rounded-2xl border border-gray-700
      bg-linear-to-br from-gray-900 via-gray-800 to-gray-900
      p-8 px-12 text-gray-100
      transition-all duration-300
      hover:shadow-xl hover:shadow-black/40
    ">
      <div className="flex items-center gap-x-6">
        {/* Avatar */}
        <div className="relative group">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="
              aspect-square w-19.5 rounded-full object-cover
              ring-2 ring-gray-600
              transition-all duration-300
              group-hover:ring-4 group-hover:ring-indigo-500/60
              group-hover:shadow-lg
            "
          />
          <span className="
            absolute inset-0 rounded-full
            opacity-0 group-hover:opacity-100
            transition duration-300
            ring-4 ring-indigo-500/20 blur-md
          " />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide text-gray-200">
            Change Profile Picture
          </p>

          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />

            {/* Select Button */}
            <button
              onClick={handleClick}
              disabled={loading}
              className="
                rounded-lg bg-gray-700 px-5 py-2
                text-sm font-medium text-gray-100
                transition-all duration-200
                hover:bg-gray-600 hover:shadow-md
                active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              Select
            </button>

            {/* Upload Button */}
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleFileUpload}
              disabled={!imageFile || loading}
              className="
                bg-indigo-600 text-white
                hover:bg-indigo-500
                shadow-md shadow-indigo-600/30
                hover:shadow-indigo-500/50
                transition-all duration-300
                active:scale-95
              "
            >
              {!loading && <FiUpload className="text-lg" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
