import { useState, useEffect } from "react"
import api from "../utils/api"
import { Link } from "react-router-dom"
import { Eye,  Clock4, Search } from "lucide-react"
import { motion as Motion } from "motion/react"
import moment from "moment/moment"
import Loading from "../components/Loading"

const Dashboard = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const initialFetch = async () => {
            try {
                setLoading(true)
                const response = await api.get("/documents")
                setDocuments(response.data)
            } catch (err) {
                setError("Failed to fetch documents.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        const refreshDocuments = async () => {
            try {
                const response = await api.get("/documents")
                setDocuments(response.data)
            } catch (err) {
                console.error("Background refresh failed:", err)
            }
        }

        initialFetch()
        const intervalId = setInterval(refreshDocuments, 2000)
        return () => clearInterval(intervalId)
    }, [])

    if (loading) {
        return (
               <Loading text={"Loading documents.."}/>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="p-8 text-center text-red-500">{error}</div>
            </div>
        )
    }


    const filteredDocuments = documents.filter((doc) =>
        doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.summary && doc.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="main-dash p-8 w-[70%] mx-auto">
                <div className="das-header flex justify-between items-center mb-6">
                    <div className=" flex flex-col gap-[12px]">
                        <h1 className="dash-header text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                            My Documents
                        </h1>
                        <p className="text-slate-700 font-medium text-center">Manage and track your document submissions with ease</p>
                    </div>
                    {userInfo?.role === "Staff" && (
                        <Link
                            to="/upload"
                            className="px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            + Upload New Document
                        </Link>
                    )}
                </div>

                {documents.length === 0 ? (
                    <div className="mt-8 p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                        <p className="text-slate-600 text-center">You haven't uploaded any documents yet.</p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">



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
                            <p className="text-center text-slate-500 mt-6">No documents match your search.</p>
                        ) : (
                            filteredDocuments.map((doc) => (
                                <Motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    key={doc._id}
                                    className="block hover:shadow-xl transition-all duration-200"
                                >
                                    <div className="flex w-full items-center justify-center p-6 gap-[20px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:bg-white/90 hover:border-blue-200">
                                        <div className="file-icon w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                <h3 className="font-semibold text-lg text-slate-800">{doc.originalName.slice(0, 30)}...</h3>
                                                <Link to={`/document/${doc._id}`}>
                                                    <Motion.button className="cursor-pointer text-slate-600 hover:text-blue-600 transition-colors">
                                                        <Eye size={20} />
                                                    </Motion.button>
                                                </Link>
                                            </div>

                                            <p className="text-slate-600 text-sm">{doc.summary.slice(0, 100)}...</p>
                                            <div className="h-[1px] bg-slate-200 w-full"></div>
                                            <div className="lower-part flex w-full items-center justify-between">
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <p className="text-sm text-slate-600">
                                                        Status:
                                                        <span
                                                            className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${doc.status === "Completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : doc.status === "Processing"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {doc.status}
                                                        </span>
                                                    </p>
                                                    {doc.approvalStatus && doc.approvalStatus !== "Not Requested" && (
                                                        <p className="text-sm text-slate-600">
                                                            Approval:
                                                            <span
                                                                className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${doc.approvalStatus === "Approved"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : doc.approvalStatus === "Pending"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {doc.approvalStatus}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-[5px]">
                                                    <Clock4 className="text-slate-500" size={15} />
                                                    <p className="text-sm text-slate-500">
                                                        {moment(doc.updatedat).format("MMMM Do YYYY, h:mm A")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
