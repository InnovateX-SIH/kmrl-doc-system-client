import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
    const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0 });
    const [recentApprovals, setRecentApprovals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and recent approvals in parallel
                const [statsRes, approvalsRes] = await Promise.all([
                    api.get('/approvals/stats'),
                    api.get('/approvals?limit=5') // Get top 5 most recent
                ]);
                setStats(statsRes.data);
                setRecentApprovals(approvalsRes.data);
            } catch (err) {
                console.error("Failed to fetch manager data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-100 p-6 rounded-lg shadow">
                    <h3 className="text-yellow-800 font-semibold">Pending Your Approval</h3>
                    <p className="text-4xl font-bold text-yellow-900">{stats.pendingCount}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow">
                    <h3 className="text-green-800 font-semibold">Documents You've Approved</h3>
                    <p className="text-4xl font-bold text-green-900">{stats.approvedCount}</p>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-col space-y-3">
                        <Link to="/approvals" className="w-full text-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">View All Pending Approvals</Link>
                        <Link to="/approved-documents" className="w-full text-center py-3 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">View All Approved Docs</Link>
                        <Link to="/stats" className="w-full text-center py-3 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">View Analytics</Link>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Pending Requests</h2>
                    {recentApprovals.length > 0 ? (
                        <ul className="space-y-3">
                            {recentApprovals.map(app => (
                                <li key={app._id} className="border-b pb-2">
                                    <Link to={`/document/${app.document._id}`} className="font-semibold text-indigo-700 hover:underline">{app.document.originalName}</Link>
                                    <p className="text-sm text-gray-500">From: {app.requester.name}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500">No recent requests.</p>}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;