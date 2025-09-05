import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0 });
  const [recentApprovals, setRecentApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, approvalsRes] = await Promise.all([
          api.get('/approvals/stats'),
          api.get('/approvals?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecentApprovals(approvalsRes.data);
      } catch (err) {
        console.error('Failed to fetch manager data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <p className='text-slate-600 text-lg font-medium'>
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      <div className='main-dash p-10 w-[70%] mx-auto space-y-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='flex justify-between items-center'
        >
          <h1 className='text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight'>
            Manager Dashboard
          </h1>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='grid grid-cols-1 md:grid-cols-2 gap-8'
        >
          <div className='p-8 rounded-2xl shadow-xl border border-white/20 bg-white/60 backdrop-blur-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300'>
            <h3 className='text-yellow-700 font-semibold text-lg'>
              Pending Your Approval
            </h3>
            <p className='text-5xl font-extrabold text-yellow-900'>
              {stats.pendingCount}
            </p>
          </div>
          <div className='p-8 rounded-2xl shadow-xl border border-white/20 bg-white/60 backdrop-blur-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300'>
            <h3 className='text-green-700 font-semibold text-lg'>
              Documents You've Approved
            </h3>
            <p className='text-5xl font-extrabold text-green-900'>
              {stats.approvedCount}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions & Recent Requests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-8'
        >
          {/* Quick Actions */}
          <div className='p-8 rounded-2xl shadow-xl border border-white/20 bg-white/60 backdrop-blur-md'>
            <h2 className='text-2xl font-semibold mb-6 text-slate-800'>
              Quick Actions
            </h2>
            <div className='flex flex-col space-y-4'>
              <Link
                to='/approvals'
                className='w-full text-center py-3 px-4 font-semibold rounded-xl 
      text-slate-800 bg-purple-100 hover:bg-purple-200 border border-purple-200 
      transition-all duration-200 shadow-sm hover:shadow-md'
              >
                View All Pending Approvals
              </Link>
              <Link
                to='/approved-documents'
                className='w-full text-center py-3 px-4 font-semibold rounded-xl 
      text-slate-800 bg-blue-100 hover:bg-blue-200 border border-blue-200 
      transition-all duration-200 shadow-sm hover:shadow-md'
              >
                View All Approved Docs
              </Link>
              <Link
                to='/stats'
                className='w-full text-center py-3 px-4 font-semibold rounded-xl 
      text-slate-800 bg-pink-100 hover:bg-pink-200 border border-pink-200 
      transition-all duration-200 shadow-sm hover:shadow-md'
              >
                View Analytics
              </Link>
            </div>
          </div>

          {/* Recent Requests */}
          <div className='p-8 rounded-2xl shadow-xl border border-white/20 bg-white/60 backdrop-blur-md'>
            <h2 className='text-2xl font-semibold mb-6 text-slate-800'>
              Recent Pending Requests
            </h2>
            {recentApprovals.length > 0 ? (
              <ul className='space-y-4'>
                {recentApprovals.map((app) => (
                  <li
                    key={app._id}
                    className='border-b border-slate-200 pb-3'
                  >
                    <Link
                      to={`/document/${app.document._id}`}
                      className='font-semibold text-indigo-700 hover:underline'
                    >
                      {app.document.originalName}
                    </Link>
                    <p className='text-sm text-slate-500'>
                      From: {app.requester.name}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-slate-500'>No recent requests.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
