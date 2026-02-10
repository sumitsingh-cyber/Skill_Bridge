import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

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
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
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
