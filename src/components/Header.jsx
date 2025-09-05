import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import AlertsDropdown from "./AlertsDropdown"
import { Menu, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const [showAlerts, setShowAlerts] = useState(false)
  const [MenuState, setMenuState] = useState(false)
  const logoutHandler = () => {

    localStorage.removeItem("userInfo")

    navigate("/login")
  }

  useEffect(() => {
    setMenuState(false)
    setShowAlerts(false)
  }, [location.pathname])

  return (
    <>
      <header className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl border-b border-purple-500/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative container mx-auto flex justify-between items-center p-6">
          <div className=" flex items-center space-x-8">
            <Link
              to={userInfo?.role === "Staff" ? "/dashboard" : "/manager-dashboard"}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105"
            >
              KMRL DocSystem
            </Link>

            <nav className="flex nav-links items-center space-x-6">
              {userInfo?.role === "Staff" && (
                <Link
                  to="/assigned-documents"
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
                >
                  Assigned to Me
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}

              <Link
                to="/profile"
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
              >
                My Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {(userInfo?.role === "Manager" || userInfo?.role === "Admin") && (
                <>
                  <Link
                    to="/approvals"
                    className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    My Approvals
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  <Link
                    to="/approved-documents"
                    className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
                  >
                    Approved Docs
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </>
              )}

              <Link
                to="/stats"
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
              >
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {userInfo?.role === "Admin" && (
                <Link
                  to="/create-user"
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
                >
                  Create User
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </nav>
          </div>

          <div className="nav-links flex items-center space-x-6">
            {userInfo && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-300 font-medium">Welcome, {userInfo.name}</span>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              {showAlerts && <AlertsDropdown />}
            </div>

            <button
              onClick={logoutHandler}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
            >
              Logout
            </button>
          </div>

          <div className="flex menu gap-[20px] items-center">
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              {showAlerts && <AlertsDropdown />}
            </div>
            <button onClick={() => setMenuState(!MenuState)} >{!MenuState ? <Menu /> : <X />}</button>

          </div>


        </div>


      </header>

      <AnimatePresence>
        {MenuState && (
          <Motion.div
            key="mobile-menu"
            initial={{ x: -1000 }}
            animate={{ x: 0 }}
            exit={{ x: -1000 }}

            className="z-[20] absolute w-full text-white mobile-menu bg-slate-800/95 backdrop-blur-sm border-t border-purple-500/20 px-6 py-4 space-y-4"
          >
            <nav className="flex flex-col space-y-4">
              {userInfo?.role === "Staff" && <Link to="/dashboard">Home</Link>}
              {userInfo?.role === "Staff" && <Link to="/assigned-documents">Assigned to Me</Link>}
              <Link to="/profile">My Profile</Link>
              {(userInfo?.role === "Manager" || userInfo?.role === "Admin") && (
                <>
                  <Link to="/approvals">My Approvals</Link>
                  <Link to="/approved-documents">Approved Docs</Link>
                </>
              )}
              <Link to="/stats">Analytics</Link>
              {userInfo?.role === "Admin" && <Link to="/create-user">Create User</Link>}
            </nav>

            <div className="flex flex-col space-y-3 border-t border-gray-600 pt-4">
              {userInfo && <span className="text-gray-300">Welcome, {userInfo.name}</span>}
              <button
                onClick={logoutHandler}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium hover:from-red-600 hover:to-red-700"
              >
                Logout
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

    </>


  )
}

export default Header
