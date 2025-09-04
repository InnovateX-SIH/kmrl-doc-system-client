import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion as Motion } from "motion/react"
import api from "../utils/api"

const DocumentDetailPage = () => {
    const { id } = useParams()
    const [document, setDocument] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [managers, setManagers] = useState([])
    const [selectedManager, setSelectedManager] = useState("")
    const [isOwner, setIsOwner] = useState(false)
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    const fetchDetails = async () => {
        try {
            setLoading(true)
            const docResponse = await api.get(`/documents/${id}`)
            setDocument(docResponse.data)

            const ownerCheck = docResponse.data.uploadedBy === userInfo._id
            setIsOwner(ownerCheck)

            if (ownerCheck && docResponse.data.approvalStatus === "Not Requested") {
                const managersResponse = await api.get("/users/managers")
                setManagers(managersResponse.data)
            }
        } catch (err) {
            console.error(err)
            setError("Failed to fetch details.")
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchDetails()
    }, [id])

    const handleRequestApproval = async () => {
        if (!selectedManager) {
            alert("Please select a manager.")
            return
        }
        try {
            await api.post(`/documents/${id}/request-approval`, { managerId: selectedManager })
            alert("Approval requested successfully!")
            fetchDetails() 
        } catch (err) {
            alert(err.response?.data?.message || "Failed to request approval.")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                    <Motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 60, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Motion.div
                            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Loading document details...
                        </p>
                    </Motion.div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Motion.div
                        className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">⚠</span>
                        </div>
                        <p className="text-xl font-semibold text-red-600">{error}</p>
                    </Motion.div>
                </div>
            </div>
        )
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <Motion.div
                        className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xl font-semibold text-gray-600">Document not found.</p>
                    </Motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <div className="absolute inset-0">
                <Motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <Motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <Motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl"
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="relative z-10 p-8 max-w-4xl mx-auto">
                <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 group transition-all duration-300"
                    >
                        <Motion.span className="text-xl" whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
                            ←
                        </Motion.span>
                        <span className="font-medium group-hover:underline">Back to Dashboard</span>
                    </Link>
                </Motion.div>

                <Motion.div
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    whileHover={{
                        y: -2,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    <Motion.h1
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        {document.originalName}
                    </Motion.h1>

                    <Motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Processing Status:</span>
                                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-medium">
                                    {document.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">File Type:</span>
                                <span className="text-sm font-semibold text-gray-800">{document.fileType}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Uploaded:</span>
                                <span className="text-sm font-semibold text-gray-800">
                                    {new Date(document.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                                <span className="text-sm font-semibold text-gray-800">
                                    {new Date(document.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Motion.div>

                    <Motion.div
                        className="border-t border-gray-200/50 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
                            Summary
                        </h2>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200/50">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {document.summary || "No summary available yet."}
                            </p>
                        </div>
                    </Motion.div>
                </Motion.div>

                {isOwner && (
                    <Motion.div
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{
                            y: -2,
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                            Approval Status
                        </h2>

                        {document.approvalStatus === "Not Requested" ? (
                            <Motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                                    <p className="text-gray-700 mb-4">Send this document to a manager for approval.</p>

                                    <label htmlFor="manager-select" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Select a Manager
                                    </label>
                                    <select
                                        id="manager-select"
                                        value={selectedManager}
                                        onChange={(e) => setSelectedManager(e.target.value)}
                                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="" disabled>
                                            -- Choose a manager --
                                        </option>
                                        {managers.map((manager) => (
                                            <option key={manager._id} value={manager._id}>
                                                {manager.name}
                                            </option>
                                        ))}
                                    </select>

                                    <Motion.button
                                        onClick={handleRequestApproval}
                                        className="mt-6 w-full px-6 py-4 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Send Request
                                    </Motion.button>
                                </div>
                            </Motion.div>
                        ) : (
                            <Motion.div
                                className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200/50"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Motion.span
                                    className={`inline-flex items-center px-6 py-3 text-lg font-semibold rounded-full shadow-lg ${document.approvalStatus === "Approved"
                                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                            : document.approvalStatus === "Pending"
                                                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                                                : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {document.approvalStatus}
                                </Motion.span>
                            </Motion.div>
                        )}
                    </Motion.div>
                )}
            </div>
        </div>
    )
}

export default DocumentDetailPage
