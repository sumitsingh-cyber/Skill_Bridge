import { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(viewData || editData || "")
  const [file, setFile] = useState(null)

  // register field with react-hook-form
  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  // update form value when file changes
  useEffect(() => {
    if (file) {
      setValue(name, file)
    }
  }, [file, name, setValue])

  // cleanup object URL (IMPORTANT)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // React 19 SAFE preview
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-200">
        {label} {!viewData && <span className="text-pink-400">*</span>}
      </label>

      <div
        onClick={() => fileInputRef.current.click()}
        className="flex min-h-62.5 cursor-pointer flex-col items-center justify-center
                   rounded-xl border-2 border-dashed border-gray-600
                   bg-gray-800 transition hover:border-gray-400"
      >
        {preview ? (
          video ? (
            <video
              src={preview}
              controls
              className="h-full w-full rounded-lg object-contain bg-black"
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
          )
        ) : (
          <>
            <FiUploadCloud className="text-3xl text-yellow-400" />
            <p className="mt-2 text-sm text-gray-300">
              Click to upload {video ? "video" : "image"}
            </p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept={video ? "video/*" : "image/*"}
          onChange={handleChange}
        />
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-400">
          {label} is required
        </span>
      )}
    </div>
  )
}
