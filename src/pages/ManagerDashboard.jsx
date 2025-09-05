import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hourglass, CheckCircle, TrendingUp, ArrowRight, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/api';
import Loading from '../components/Loading'; // Assuming you have a Loading component

const ManagerDashboard = () => {
    const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0 });
    const [chartData, setChartData] = useState([]);
    const [recentApprovals, setRecentApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, approvalsRes, chartRes] = await Promise.all([
                    api.get('/approvals/stats'),
                    api.get('/approvals?limit=5'),
                    api.get('/documents/stats')
                ]);
                setStats(statsRes.data);
                setRecentApprovals(approvalsRes.data);
                
                const formattedChartData = chartRes.data.map((item, index) => ({
                    name: item.category,
                    value: item.count,
                    color: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'][index % 5]
                }));
                setChartData(formattedChartData);

            } catch (err) {
                setError("Failed to load dashboard data.");
                console.error('Failed to fetch manager data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <Loading text={"Loading Manager Dashboard..."} />;
    }
    
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            {/* Header */}
            <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white rounded-2xl p-8 shadow-lg border">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Manager Command Center</h1>
                                <p className="text-gray-500">Oversee approvals and analyze document flow.</p>
                            </div>
                        </div>
                         <p className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            System Status: Operational
                         </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                {/* Main Column: Recent Activity & Actions */}
                <div className="xl:col-span-2 space-y-8">
                    <motion.div 
                        className="bg-white p-6 rounded-2xl shadow-lg border"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Pending Requests</h2>
                        {recentApprovals.length > 0 ? (
                            <ul className="space-y-3">
                                {recentApprovals.map(app => (
                                    <li key={app._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <Link to={`/document/${app.document._id}`} className="font-semibold text-indigo-700 hover:underline">{app.document.originalName}</Link>
                                            <p className="text-sm text-gray-500">From: {app.requester.name}</p>
                                        </div>
                                        <Link to="/approvals" className="text-sm font-medium text-blue-600 hover:text-blue-800">Review</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-gray-500">Your approval queue is clear!</p>}
                    </motion.div>
                </div>

                {/* Side Column: Stats & Analytics */}
                <div className="space-y-8">
                    <motion.div 
                        className="bg-white p-6 rounded-2xl shadow-lg border"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Stats</h2>
                         <div className="space-y-4">
                             <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Hourglass className="h-6 w-6 text-yellow-600" />
                                <div>
                                    <p className="text-2xl font-bold text-yellow-800">{stats.pendingCount}</p>
                                    <p className="text-sm font-medium text-yellow-700">Pending Your Approval</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold text-green-800">{stats.approvedCount}</p>
                                    <p className="text-sm font-medium text-green-700">Documents You've Approved</p>
                                </div>
                             </div>
                         </div>
                    </motion.div>

                    <motion.div 
                        className="bg-white p-6 rounded-2xl shadow-lg border"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><TrendingUp className="text-purple-600" /> Document Categories</h2>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                                        {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;