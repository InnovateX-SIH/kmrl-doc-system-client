"use client"
import { useState, useEffect } from "react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import { motion as Motion } from "motion/react"
import { Clock4, Search } from "lucide-react"
import Loading from "../components/Loading"
import moment from "moment"

const ApprovedDocsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // --- MODAL STATES ---
  const [showModal, setShowModal] = useState(false)
  const [staffList, setStaffList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState("")
  const [currentDocId, setCurrentDocId] = useState(null)

  // --- LOCAL STORAGE FOR FORWARDED DOCS ---
  const [forwardedDocs, setForwardedDocs] = useState([])

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("forwardedDocs")) || []
    setForwardedDocs(storedDocs)

    const fetchApprovedDocs = async () => {
      try {
        setLoading(true)
        const { data } = await api.get("/documents/approved")
        setDocuments(data)
      } catch (err) {
        setError("Failed to fetch approved documents.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchApprovedDocs()
  }, [])

  const openForwardModal = async (docId) => {
    try {
      const { data } = await api.get("/users/staff")
      setStaffList(data)
      setCurrentDocId(docId)
      setSelectedStaff("")
      setShowModal(true)
    } catch (err) {
      alert("Could not fetch the staff list.")
      console.error(err)
    }
  }

  const handleForward = async () => {
    if (!selectedStaff) {
      alert("Please select a staff member.")
      return
    }
    try {
      await api.post(`/documents/${currentDocId}/forward`, {
        staffId: selectedStaff,
      })

      // Save forwarded doc ID to localStorage
      const updatedForwardedDocs = [...forwardedDocs, currentDocId]
      setForwardedDocs(updatedForwardedDocs)
      localStorage.setItem("forwardedDocs", JSON.stringify(updatedForwardedDocs))

      alert("Document forwarded successfully!")
      setShowModal(false)
    } catch (err) {
      alert("Failed to forward the document.")
      console.error(err)
    }
  }

  // --- FILTERING LOGIC ---
  const filteredDocuments = documents
    .filter((doc) =>
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((doc) => !forwardedDocs.includes(doc._id)) // hide forwarded docs

  if (loading) return <Loading text={"Loading..."} />

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-8 text-center text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="main-dash p-8 w-[70%] mx-auto">
        <div className="das-header flex justify-between items-center mb-6">
          <div className="flex flex-col gap-[12px]">
            <h1 className="dash-header text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Approved Documents
            </h1>
            <p className="text-slate-700 font-medium text-center">
              Review and forward approved documents to staff members
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex shadow-lg backdrop-blur-sm border border-white/30 bg-white/80 items-center px-[20px] rounded-full h-[60px] w-[100%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="bg-transparent outline-none w-full h-full"
            placeholder="Search for document"
          />
          <Search size={20} />
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="mt-8 p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
            <p className="text-slate-600 text-center">
              No documents available (either none approved or all forwarded).
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredDocuments.map((doc) => (
              <Motion.div
                key={doc._id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="block hover:shadow-xl transition-all duration-200"
              >
                <div className="flex w-full items-center justify-center p-6 gap-[20px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:bg-white/90 hover:border-blue-200">
                  <div className="file-icon w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col w-[90%] gap-[10px]">
                    <div className="flex w-full justify-between items-center">
                      <Link to={`/document/${doc._id}`}>
                        <h3 className="font-semibold text-lg text-slate-800 hover:text-blue-600 transition-colors">
                          {doc.originalName}
                        </h3>
                      </Link>
                      <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openForwardModal(doc._id)}
                        className="px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Forward
                      </Motion.button>
                    </div>

                    <p className="text-slate-600">
                      Uploaded by:{" "}
                      <span className="font-medium text-slate-800">
                        {doc.uploadedBy?.name}
                      </span>
                    </p>
                    <div className="h-[1px] bg-slate-200 w-full"></div>
                    <div className="lower-part flex w-full items-center justify-between">
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-sm text-slate-600">
                          Status:
                          <span className="ml-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-[5px]">
                        <Clock4 className="text-slate-500" size={15} />
                        <p className="text-sm text-slate-500">
                          {moment(doc.createdAt).format(
                            "MMMM Do YYYY, h:mm A"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-sm border border-white/20 p-8 rounded-xl shadow-lg w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Forward Document
              </h2>
              <label
                htmlFor="staff-select"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Select a staff member:
              </label>
              <select
                id="staff-select"
                onChange={(e) => setSelectedStaff(e.target.value)}
                value={selectedStaff}
                className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="" disabled className="bg-white text-slate-800">
                  -- Select Staff --
                </option>
                {staffList.map((staff) => (
                  <option
                    key={staff._id}
                    value={staff._id}
                    className="bg-white text-slate-800"
                  >
                    {staff.name}
                  </option>
                ))}
              </select>
              <div className="mt-8 flex justify-end space-x-4">
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 border border-slate-300 transition-all duration-200"
                >
                  Cancel
                </Motion.button>
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleForward}
                  className="px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Confirm & Forward
                </Motion.button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </div>
    </div>
  )
}

export default ApprovedDocsPage
