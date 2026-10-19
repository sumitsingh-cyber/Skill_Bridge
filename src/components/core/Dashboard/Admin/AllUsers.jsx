import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  FiUsers,
  FiSearch,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiUserCheck,
} from "react-icons/fi"
import {
  getAllPlatformUsers,
  updateUserRole,
  deletePlatformUser,
} from "../../../../services/operations/adminAPI"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function AllUsers() {
  const { user: currentUser } = useSelector((state) => state.profile)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUserId, setEditingUserId] = useState(null)
  const [newRoleValue, setNewRoleValue] = useState("")
  const [confirmationModal, setConfirmationModal] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    const result = await getAllPlatformUsers(selectedRole)
    if (result) {
      setUsers(result)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedRole])

  const handleRoleChangeSubmit = async (userId) => {
    if (!newRoleValue) return
    const success = await updateUserRole(userId, newRoleValue)
    if (success) {
      setEditingUserId(null)
      fetchUsers()
    }
  }

  const handleDeleteUser = async (userId) => {
    const success = await deletePlatformUser(userId)
    if (success) {
      fetchUsers()
    }
    setConfirmationModal(null)
  }

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase()
    const email = (u.email || "").toLowerCase()
    const q = searchTerm.toLowerCase()
    return fullName.includes(q) || email.includes(q)
  })

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
          <p className="mt-1 text-sm text-gray-400">
            View all registered accounts, switch roles, or manage users across the system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Student", "Instructor", "Admin"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                selectedRole === role
                  ? "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-900/90 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 backdrop-blur-md focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="grid min-h-60 place-items-center">
          <div className="spinner"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 py-16 text-center">
          <FiUsers className="mx-auto text-4xl text-gray-600" />
          <p className="mt-3 text-lg font-medium text-gray-300">No users match your criteria</p>
          <p className="text-sm text-gray-500">Try adjusting your search query or role filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/80 shadow-xl backdrop-blur-md">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-950/60 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-normal">
              {filteredUsers.map((u) => {
                const isSelf = u._id === currentUser?._id
                const isEditing = editingUserId === u._id

                return (
                  <tr
                    key={u._id}
                    className="transition-colors hover:bg-gray-800/30"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.Image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${u.firstName}%20${u.lastName}`
                          }
                          alt={u.firstName}
                          className="h-10 w-10 rounded-full object-cover border border-gray-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-100">
                              {u.firstName} {u.lastName}
                            </p>
                            {isSelf && (
                              <span className="rounded-md bg-yellow-400/20 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {u.additionalDetails?.contactNumber || "No phone"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">
                      {u.email}
                    </td>

                    {/* Role / Role Selector */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={newRoleValue}
                            onChange={(e) => setNewRoleValue(e.target.value)}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-100 focus:border-yellow-400 focus:outline-none"
                          >
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRoleChangeSubmit(u._id)}
                            className="rounded-md bg-emerald-500/20 p-1 text-emerald-400 hover:bg-emerald-500/30"
                            title="Save"
                          >
                            <FiCheck size={14} />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="rounded-md bg-gray-800 p-1 text-gray-400 hover:bg-gray-700"
                            title="Cancel"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.accountType === "Admin"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : u.accountType === "Instructor"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          <FiUserCheck className="text-[10px]" />
                          {u.accountType}
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingUserId(u._id)
                              setNewRoleValue(u.accountType)
                            }}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-yellow-400 transition-colors"
                            title="Change Role"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}

                        {!isSelf && (
                          <button
                            onClick={() =>
                              setConfirmationModal({
                                text1: "Delete User Account?",
                                text2: `Are you sure you want to permanently delete "${u.firstName} ${u.lastName}" (${u.email})?`,
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteUser(u._id),
                                btn2Handler: () => setConfirmationModal(null),
                              })
                            }
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}
