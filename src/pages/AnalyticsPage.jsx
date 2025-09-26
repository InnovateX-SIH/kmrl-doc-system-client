"use client"

import { useState, useEffect } from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { motion as Motion } from "motion/react"
import api from "../utils/api"
import Loading from "../components/Loading"

ChartJS.register(ArcElement, Tooltip, Legend)

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/documents/stats")

        const formattedData = {
          labels: data.map((item) => item.category),
          datasets: [
            {
              label: "# of Documents",
              data: data.map((item) => item.count),
              backgroundColor: [
                "rgba(99, 102, 241, 0.8)",
                "rgba(236, 72, 153, 0.8)",
                "rgba(34, 197, 94, 0.8)",
                "rgba(251, 146, 60, 0.8)",
                "rgba(168, 85, 247, 0.8)",
                "rgba(14, 165, 233, 0.8)",
              ],
              borderColor: [
                "rgba(99, 102, 241, 1)",
                "rgba(236, 72, 153, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(251, 146, 60, 1)",
                "rgba(168, 85, 247, 1)",
                "rgba(14, 165, 233, 1)",
              ],
              borderWidth: 2,
            },
          ],
        }
        setChartData(formattedData)
      } catch (err) {
        setError("Failed to fetch analytics data.")
        console.error("Failed to fetch stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <Loading text={"Loading analytics..."} />
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-8 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xl font-semibold"
          >
            {error}
          </Motion.div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Document Analytics
            </h1>
            <p className="text-gray-600 text-lg">Insights into your document management system</p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Documents by Category
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>

            {chartData && chartData.labels.length > 0 ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col lg:flex-row items-center justify-center gap-8"
              >
                <div className="w-full max-w-md">
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                              size: 12,
                              weight: "500",
                            },
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          titleColor: "white",
                          bodyColor: "white",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: true,
                        },
                      },
                    }}
                  />
                </div>

                <div className="w-full lg:w-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {chartData.labels.map((label, index) => (
                      <Motion.div
                        key={label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4 hover:bg-white/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: chartData.datasets[0].backgroundColor[index],
                              }}
                            ></div>
                            <span className="font-medium text-gray-700">{label}</span>
                          </div>
                          <span className="text-xl font-bold text-gray-800">{chartData.datasets[0].data[index]}</span>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>
              </Motion.div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">No classified documents available to display.</p>
                <p className="text-gray-500 text-sm mt-2">Upload some documents to see analytics here.</p>
              </Motion.div>
            )}
          </Motion.div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
