import { useState, useEffect } from "react"
import { motion as Motion, AnimatePresence } from "framer-motion"
import api from "../utils/api"
import { Link } from "react-router-dom"

const AlertsDropdown = () => {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get("/alerts")
        setAlerts(data)
      } catch (err) {
        console.error("Failed to fetch alerts", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  return (
    <Motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl z-50 border border-white/20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
      }}
    >
      <div className="p-6 font-bold border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg">
        Notifications
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-8 text-center"
            >
              <Motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-8 h-8 mx-auto mb-3 border-2 border-blue-200 border-t-blue-600 rounded-full"
              />
              <p className="text-sm text-gray-500 font-medium">Loading notifications...</p>
            </Motion.div>
          ) : alerts.length === 0 ? (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-8 text-center">
              <Motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
                className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-7A2.5 2.5 0 016.5 7H18a2.5 2.5 0 012.5 2.5v7a2.5 2.5 0 01-2.5 2.5H13"
                  />
                </svg>
              </Motion.div>
              <p className="text-sm text-gray-500 font-medium">No new notifications</p>
              <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
            </Motion.div>
          ) : (
            <ul className="py-2">
              {alerts.map((alert, index) => (
                <Motion.li
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={alert.link || "#"}
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100/50 last:border-b-0 group"
                  >
                    <Motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-200">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Motion.div>
                  </Link>
                </Motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  )
}

export default AlertsDropdown
