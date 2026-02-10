import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag || [])
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()

      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue])
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    setChips(chips.filter((_, index) => index !== chipIndex))
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label
        className="text-sm font-medium text-gray-100"
        htmlFor={name}
      >
        {label} <sup className="text-pink-400">*</sup>
      </label>

      {/* Chips + Input */}
      <div
        className="flex w-full flex-wrap items-center gap-2 rounded-lg
                   border border-gray-700 bg-gray-800 p-2
                   transition-colors duration-300
                   focus-within:border-yellow-400"
      >
        {/* Chips */}
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center rounded-full
                       bg-yellow-400 px-3 py-1 text-sm
                       text-gray-900
                       transition-all duration-200
                       hover:scale-105"
          >
            {chip}
            <button
              type="button"
              onClick={() => handleDeleteChip(index)}
              className="ml-2 rounded-full p-0.5
                         transition-colors duration-200
                         hover:bg-yellow-300 focus:outline-none"
            >
              <MdClose className="text-xs" />
            </button>
          </div>
        ))}

        {/* Input */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent px-2 py-1
                     text-sm text-gray-100
                     placeholder-gray-400
                     outline-none"
        />
      </div>

      {/* Error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-400">
          {label} is required
        </span>
      )}
    </div>
  )
}
