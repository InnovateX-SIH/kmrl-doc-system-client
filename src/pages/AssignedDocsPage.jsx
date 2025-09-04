import { useState, useEffect } from "react"
import { motion as Motion, AnimatePresence } from "motion/react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import Loading from "../components/Loading"
const AssignedDocsPage = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedDocs = async () => {
      try {
        const { data } = await api.get("/alerts/assigned")
        setAssignments(data.filter((item) => item.document))
      } finally {
        setLoading(false)
      }
    }
    fetchAssignedDocs()
  }, [])

  if (loading) {
    return (
      <Loading text={"Loading your assignments..."} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
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
      </div>

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <Motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Documents Assigned to Me
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </Motion.div>

        <Motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Assignments</h3>
                  <p className="text-gray-600">Documents requiring your attention</p>
                </div>
              </div>
              <Motion.div
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              >
                {assignments.length}
              </Motion.div>
            </div>
          </div>
        </Motion.div>

        {assignments.length === 0 ? (

          <Motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Assignments Yet</h3>
            <p className="text-gray-500 text-lg">No documents are currently assigned to you.</p>
          </Motion.div>
        ) : (
          <Motion.div
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence>
              {assignments.map((item, index) => (
                <Motion.div
                  key={item._id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >

                  <div className="bg-white/70 w-full backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-blue-200/50">
                    <div className="flex flex-col gap-[20px]">
                      <div className="w-full flex flex-col">
                        <Link
                          to={`/document/${item.document._id}`}
                          className="block group-hover:text-blue-600 transition-colors duration-200"
                        >
                          <div className=" flex items-center space-x-3 mb-3">
                            <div className="file-icon w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                              {item.document.originalName}
                            </h3>
                          </div>

                        </Link>

                        <div className="assigned-doc bg-blue-50/50 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
                          <p className="text-gray-700 italic font-medium">"{item.message}"</p>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Assigned on {new Date(item.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Motion.div
                        className="ml-4  transition-opacity duration-200"
                        whileHover={{ scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/document/${item.document._id}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <span className="text-sm font-medium">View Document</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </Motion.div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </AnimatePresence>
          </Motion.div>
        )}
      </div>
    </div>
  )
}

export default AssignedDocsPage
