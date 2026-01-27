import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"

import Home from "./pages/Home"
import Login from "./pages/login"
import Signup from "./pages/Signup"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import Navbar from "./components/common/Navbar.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import UpdatePassword from "./pages/UpdatePassword.jsx"

import Dashboard from "./pages/Dashboard.jsx"
import MyProfile from "./components/core/Dashboard/MyProfile.jsx"
import Settings from "./components/core/Dashboard/Settings.jsx/index.jsx"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx"
import Cart from "./components/core/Dashboard/Cart/index.jsx"
import AddCourse from "./components/core/Dashboard/AddCourse"
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse"
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor.jsx"

import Catalog from "./pages/catalog.jsx"
import CourseDetails from "./pages/CourseDetails"
import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Error from "./pages/Error"

import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"

import { ACCOUNT_TYPE } from "./utils/constants.js"
import "./App.css"

function App() {
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col font-inter">
      <Navbar />

      <Routes>
        {/* ========= Public Routes ========= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        {/* ========= Open Routes ========= */}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:token"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* ========= Dashboard (Protected) ========= */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Default */}
          <Route index element={<MyProfile />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {/* Student */}
          <Route
            path="cart"
            element={
              user?.accountType === ACCOUNT_TYPE.STUDENT ? (
                <Cart />
              ) : (
                <MyProfile />
              )
            }
          />
          <Route
            path="enrolled-courses"
            element={
              user?.accountType === ACCOUNT_TYPE.STUDENT ? (
                <EnrolledCourses />
              ) : (
                <MyProfile />
              )
            }
          />

          {/* Instructor */}
          <Route
            path="instructor"
            element={
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                <Instructor />
              ) : (
                <MyProfile />
              )
            }
          />
          <Route
            path="add-course"
            element={
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                <AddCourse />
              ) : (
                <MyProfile />
              )
            }
          />
          <Route
            path="my-courses"
            element={
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                <MyCourses />
              ) : (
                <MyProfile />
              )
            }
          />
          <Route
            path="edit-course/:courseId"
            element={
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                <EditCourse />
              ) : (
                <MyProfile />
              )
            }
          />
        </Route>

        {/* ========= View Course (Student Only) ========= */}
        <Route
          path="/view-course/:courseId/*"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route
              path="section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          )}
        </Route>

        {/* ========= 404 ========= */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
