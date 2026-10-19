import { useCallback, useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { Link, matchPath, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

import logo from "../../assets/Logo/logonav.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogOpenMobile, setCatalogOpenMobile] = useState(false)

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector(
          "GET",
          categories.CATEGORIES_API
        )
        setSubLinks(res?.data?.data ?? [])
      } catch (error) {
        console.error("Could not fetch categories", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const matchRoute = useCallback(
    (route) => matchPath({ path: route }, location.pathname),
    [location.pathname]
  )

  const isStudent = user?.accountType?.toLowerCase() === ACCOUNT_TYPE.STUDENT.toLowerCase()

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-lg transition-all duration-300 ${
        location.pathname !== "/"
          ? "bg-gray-900/90 shadow-lg"
          : "bg-gray-950/80"
      }`}
    >
      <div className="mx-auto flex h-14 w-11/12 max-w-maxContent items-center justify-between rounded-xl bg-gray-800/70 px-4 sm:px-6 shadow-md transition-all duration-300 hover:shadow-yellow-500/10">

        {/* Logo */}
        <Link to="/" aria-label="Home" className="shrink-0">
          <img
            src={logo}
            alt="Logo"
            width={140}
            height={28}
            loading="lazy"
            className="transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-200">
            {NavbarLinks.map((link) => (
              <li key={link.title} className="relative">
                {link.title === "Catalog" ? (
                  <div
                    className={`group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-all duration-300 hover:bg-gray-700/50 hover:text-yellow-400 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-400"
                        : ""
                    }`}
                  >
                    <span>{link.title}</span>
                    <BsChevronDown className="text-xs transition-transform duration-300 group-hover:rotate-180" />

                    {/* Dropdown */}
                    <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-gray-900/95 p-4 text-gray-100 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
                      {loading ? (
                        <p className="text-center text-sm text-gray-300">
                          Loading...
                        </p>
                      ) : subLinks.length > 0 ? (
                        subLinks.map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/catalog/${cat.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="group block rounded-lg px-4 py-2 text-sm transition-all duration-300 hover:bg-yellow-400/10 hover:text-yellow-400 hover:pl-6"
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-400">
                          No categories available
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`relative px-1 py-2 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:text-yellow-400 hover:after:w-full ${
                      matchRoute(link.path)
                        ? "text-yellow-400 after:w-full"
                        : ""
                    }`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          {isStudent && (
            <Link to="/dashboard/cart" className="relative p-1">
              <AiOutlineShoppingCart className="text-2xl text-gray-200 transition-all duration-300 hover:scale-110 hover:text-yellow-400 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-yellow-400 text-xs font-bold text-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login">
                <button className="rounded-md border border-gray-600 px-4 py-1.5 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-md active:scale-95">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-95">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile Header Right */}
        <div className="flex items-center gap-3 md:hidden">
          {isStudent && (
            <Link to="/dashboard/cart" className="relative p-1">
              <AiOutlineShoppingCart className="text-2xl text-gray-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-yellow-400 text-[10px] font-bold text-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token && <ProfileDropdown />}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="rounded-lg p-1 text-gray-200 transition-colors hover:bg-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={24} className="text-yellow-400" />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-40 md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative z-50 flex h-[calc(100vh-3.5rem)] w-3/4 max-w-xs flex-col justify-between border-r border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Navigation
              </p>
              <div className="flex flex-col gap-2">
                {NavbarLinks.map((link) => {
                  if (link.title === "Catalog") {
                    return (
                      <div key={link.title} className="space-y-1">
                        <button
                          onClick={() => setCatalogOpenMobile((prev) => !prev)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800"
                        >
                          <span>{link.title}</span>
                          <BsChevronDown
                            className={`text-xs transition-transform ${
                              catalogOpenMobile ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {catalogOpenMobile && (
                          <div className="ml-3 space-y-1 border-l border-gray-700 pl-3">
                            {subLinks.map((cat) => (
                              <Link
                                key={cat._id}
                                to={`/catalog/${cat.name
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-md px-2 py-1.5 text-xs text-gray-400 hover:text-yellow-400"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={link.title}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        matchRoute(link.path)
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bottom Mobile Action Buttons */}
            {!token ? (
              <div className="flex flex-col gap-3 pt-6 border-t border-gray-800">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-xl border border-gray-700 py-2.5 text-sm font-medium text-gray-200 hover:border-gray-500">
                    Log in
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full rounded-xl bg-yellow-400 py-2.5 text-sm font-semibold text-gray-900 shadow-md shadow-yellow-500/20 hover:bg-yellow-300">
                    Sign up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-800">
                <Link
                  to="/dashboard/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-gray-800/80 p-3 hover:bg-gray-800"
                >
                  <img
                    src={user?.image}
                    alt={user?.firstName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user?.accountType}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

