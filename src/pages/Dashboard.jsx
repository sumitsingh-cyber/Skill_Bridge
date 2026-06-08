import { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-gray-950">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-gray-950">
      
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Sidebar Toggle Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-200 focus:outline-none flex items-center gap-x-2"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            <span className="font-semibold text-sm">Dashboard Menu</span>
          </button>
        </div>

        <div className="mx-auto w-11/12 max-w-300 py-10">
          <section className="rounded-xl bg-gray-900 border border-gray-800 p-6 sm:p-8">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

