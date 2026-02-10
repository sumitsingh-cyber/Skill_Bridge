import { useCallback, useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
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

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector(
          "GET",
          categories.CATEGORIES_API
        )

        // ✅ FIXED: backend sends categories in `data`
        setSubLinks(res?.data?.data ?? [])
      } catch (error) {
        console.error("Could not fetch categories", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const matchRoute = useCallback(
    (route) => matchPath({ path: route }, location.pathname),
    [location.pathname]
  )

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-lg transition-all duration-300 ${
        location.pathname !== "/"
          ? "bg-gray-900/80 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-11/12 max-w-maxContent items-center justify-between rounded-xl bg-gray-800/70 px-6 shadow-md transition-all duration-300 hover:shadow-yellow-500/10">

        {/* Logo */}
        <Link to="/" aria-label="Home">
          <img
            src={logo}
            alt="Logo"
            width={160}
            height={32}
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
                    <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-gray-900/90 p-4 text-gray-100 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
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

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-gray-200 transition-all duration-300 hover:scale-110 hover:text-yellow-400 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 animate-pulse place-items-center rounded-full bg-yellow-400 text-xs font-bold text-gray-900">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login">
                <button className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400 hover:shadow-md">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile Menu */}
        <button className="mr-2 text-gray-200 md:hidden">
          <AiOutlineMenu
            size={24}
            className="transition-transform duration-300 hover:scale-110 hover:text-yellow-400"
          />
        </button>
      </div>
    </header>
  )
}

export default Navbar
