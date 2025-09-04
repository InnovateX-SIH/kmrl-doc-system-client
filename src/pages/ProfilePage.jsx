import { useState, useEffect } from "react"
import { motion as Motion } from "motion/react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import Loading from "../components/Loading"
const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([api.get("/users/profile"), api.get("/users/history")])
        setProfile(profileRes.data)
        setHistory(historyRes.data)
      } catch (error) {
        console.error("Failed to fetch profile data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  if (loading) {
    return (
            <Loading text={"Loading profile"}/>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <Motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <Motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <Motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </Motion.div>

        {profile && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 mb-12 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <Motion.div
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {profile.name?.charAt(0)?.toUpperCase()}
              </Motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                <p className="text-gray-600">{profile.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                <p className="font-semibold text-gray-800">{profile.email}</p>
              </Motion.div>

              <Motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-semibold text-gray-800">{profile.department}</p>
              </Motion.div>
            </div>
          </Motion.div>
        )}

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-8 text-center">
            Activity History
          </h2>

          <div className="space-y-4">
            {history.map((event, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <Motion.div
                    className={`w-3 h-3 rounded-full mt-2 ${
                      event.type === "UPLOAD"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-blue-400 to-indigo-500"
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="flex-1">
                    {event.type === "UPLOAD" && (
                      <p className="text-gray-700">
                        You uploaded the document:{" "}
                        <Link
                          to={`/document/${event.item._id}`}
                          className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                        >
                          {event.item.originalName}
                        </Link>
                      </p>
                    )}
                    {event.type === "APPROVAL" && (
                      <p className="text-gray-700">
                        Approval status for "{event.item.document?.originalName}" was updated to{" "}
                        <span
                          className={`font-bold ${
                            event.item.status === "Approved"
                              ? "text-green-600"
                              : event.item.status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {event.item.status}
                        </span>
                        .
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
