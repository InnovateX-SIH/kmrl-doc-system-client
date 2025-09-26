"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import Loading from "../components/Loading"
import { motion as Motion } from "motion/react"
import { CheckCircle, XCircle, FileText, User, Mail , Search } from "lucide-react"

const ApprovalsPage = () => {
    const [approvals, setApprovals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")



    const fetchData = async () => {
        try {
            const [approvalsRes] = await Promise.all([api.get("/approvals"), api.get("/users/managers")])
            setApprovals(approvalsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))



        } catch (err) {
            setError("Failed to fetch data.")
            console.error(err)
        }
    }

    useEffect(() => {
        // Initial fetch with loading indicator
        const initialFetch = async () => {
            setLoading(true)
            await fetchData()
            setLoading(false)
        }
        initialFetch()

        // Set up interval for silent background refresh
        const intervalId = setInterval(fetchData, 3000) // Refresh every 3 seconds

        // Cleanup
        return () => clearInterval(intervalId)
    }, [])

    const handleDecision = async (approvalId, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this document?`)) {
            return
        }
        try {
            await api.put(`/approvals/${approvalId}/decision`, { status })
            alert(`Request has been ${status.toLowerCase()}!`)

            setApprovals((prev) => prev.filter((app) => app._id !== approvalId))
        } catch (err) {
            alert("Failed to process the request.")
            console.error(err)
        }
    }



    if (loading) return <Loading text={"Loading approvals..."} />

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="p-8 text-center text-red-500">{error}</div>
            </div>
        )
    }
    
    const filteredDocuments = approvals.filter((doc) =>
       
        doc.document.originalName.toLowerCase().includes(searchTerm.toLowerCase()) 
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="p-8 w-[70%] mx-auto">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight mb-3">
                        Pending Approvals
                    </h1>
                    <p className="text-slate-700 font-medium">Review and manage document approval requests</p>
                </div>

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
                    <div className="p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                        <p className="text-slate-600 text-center">You have no pending approval requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-6">
                        {filteredDocuments.map((approval) => (
                            <Motion.div
                                key={approval._id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className="p-6 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:bg-white/90 hover:border-blue-200 hover:shadow-xl transition-all duration-200"
                            >
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-slate-800 mb-2">
                                                <Link
                                                    to={`/document/${approval.document._id}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {approval.document.originalName}
                                                </Link>
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{approval.requester.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{approval.requester.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0">
                                        <Motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDecision(approval._id, "Approved")}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </Motion.button>

                                        <Motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDecision(approval._id, "Rejected")}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </Motion.button>


                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApprovalsPage
