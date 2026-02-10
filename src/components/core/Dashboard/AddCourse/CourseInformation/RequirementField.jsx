import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || [])
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementsList([...requirementsList, requirement.trim()])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label className="text-sm font-medium text-gray-100" htmlFor={name}>
        {label} <sup className="text-pink-400">*</sup>
      </label>

      {/* Input + Add Button */}
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter a requirement"
          className="w-full rounded-md bg-gray-800 px-3 py-2
                     text-gray-100 placeholder-gray-400
                     outline-none transition-all
                     focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="text-sm font-semibold text-yellow-400
                     transition-colors duration-200
                     hover:text-yellow-300"
        >
          + Add requirement
        </button>
      </div>

      {/* Requirements List */}
      {requirementsList.length > 0 && (
        <ul className="mt-2 space-y-2">
          {requirementsList.map((requirement, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md
                         bg-gray-800 px-3 py-2 text-sm text-gray-100
                         transition-colors duration-200
                         hover:bg-gray-700"
            >
              <span>{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-gray-400
                           transition-colors duration-200
                           hover:text-red-400"
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-400">
          {label} is required
        </span>
      )}
    </div>
  )
}
