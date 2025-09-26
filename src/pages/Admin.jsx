import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Check,
  Building2,
  Search,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/api';

// --- HELPER COMPONENTS ---
const Avatar = ({ name }) => (
  <div className='relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold'>
    <span className='select-none text-sm'>
      {name
        .split(' ')
        .map((n) => n[0])
        .join('')}
    </span>
  </div>
);

const UserModal = ({ open, onClose, onSave, editingUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [department, setDepartment] = useState('General');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setDepartment(editingUser.department);
    } else {
      setName('');
      setEmail('');
      setRole('Staff');
      setDepartment('General');
    }
  }, [editingUser, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ _id: editingUser?._id, name, email, role, department });
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <motion.div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className='relative z-10 w-full max-w-lg rounded-2xl border border-white/30 bg-white/80 backdrop-blur-lg p-6 shadow-2xl'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6'>
          {editingUser ? 'Edit User' : 'Add New User'}
        </h3>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Full Name'
            required
            className='w-full p-3 border border-white/30 rounded-lg bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-blue-500 outline-none'
          />
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email Address'
            required
            className='w-full p-3 border border-white/30 rounded-lg bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-blue-500 outline-none'
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='w-full p-3 border border-white/30 rounded-lg bg-white/70 backdrop-blur-md'
          >
            <option value='Staff'>Staff</option>
            <option value='Manager'>Manager</option>
            <option value='Admin'>Admin</option>
          </select>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className='w-full p-3 border border-white/30 rounded-lg bg-white/70 backdrop-blur-md'
          >
            <option value='General'>General</option>
            <option value='Engineering'>Engineering</option>
            <option value='HR'>HR</option>
            <option value='Finance'>Finance</option>
            <option value='Safety'>Safety</option>
            <option value='Procurement'>Procurement</option>
          </select>
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transition'
            >
              {editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes, alertsRes] = await Promise.all([
        api.get('/users'),
        api.get('/documents/stats'),
        api.get('/alerts'),
      ]);
      setUsers(usersRes.data);
      const chartFormatted = statsRes.data.map((item) => ({
        name: item.category,
        value: item.count,
      }));
      setChartData(chartFormatted);
      setEvents(alertsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesDepartment =
        departmentFilter === 'all' || user.department === departmentFilter;
      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [users, searchTerm, roleFilter, departmentFilter]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8'>
      {/* Header */}
      <h1 className='text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-10'>
        Administrator Control Tower
      </h1>

      <div className='grid grid-cols-1 gap-8 xl:grid-cols-3'>
        {/* Users Section */}
        <div className='xl:col-span-2 bg-white/80 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-semibold flex items-center gap-2 text-slate-800'>
              <Users className='text-blue-600' /> User Administration
            </h2>
            <button
              onClick={() => {
                setEditingUser(null);
                setModalOpen(true);
              }}
              className='px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transition'
            >
              <span className='flex items-center gap-2'>
                <Plus size={16} /> Add User
              </span>
            </button>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            {/* Search Bar - Left */}
            <div className='relative flex-1 max-w-sm'>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search users...'
                className='w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none'
              />
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
            </div>

            {/* Filters - Right */}
            <div className='flex items-center gap-4'>
              {/* Role Filter */}
              <div className='relative'>
                <Users className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className='appearance-none pl-9 pr-8 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm'
                >
                  <option value='all'>All Roles</option>
                  <option value='Admin'>Admin</option>
                  <option value='Manager'>Manager</option>
                  <option value='Staff'>Staff</option>
                </select>
                <span className='absolute right-3 top-2.5 text-gray-400'>
                  ▾
                </span>
              </div>

              {/* Department Filter */}
              <div className='relative'>
                <Building2 className='absolute left-3 top-2.5 h-4 w-4 text-gray-400' />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className='appearance-none pl-9 pr-8 py-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm'
                >
                  <option value='all'>All Departments</option>
                  <option value='General'>General</option>
                  <option value='Engineering'>Engineering</option>
                  <option value='HR'>HR</option>
                  <option value='Finance'>Finance</option>
                  <option value='Safety'>Safety</option>
                  <option value='Procurement'>Procurement</option>
                </select>
                <span className='absolute right-3 top-2.5 text-gray-400'>
                  ▾
                </span>
              </div>
            </div>
          </div>
          {/* User Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-gradient-to-r from-blue-100 to-indigo-100'>
                <tr>
                  <th className='p-3'>User</th>
                  <th className='p-3'>Role</th>
                  <th className='p-3'>Department</th>
                  <th className='p-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className='border-b border-white/30 hover:bg-white/70 transition'
                  >
                    <td className='p-3 flex items-center gap-3'>
                      <Avatar name={user.name} />
                      <div>
                        <div className='font-medium text-slate-800'>
                          {user.name}
                        </div>
                        <div className='text-xs text-slate-500'>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className='p-3'>
                      <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                        {user.role}
                      </span>
                    </td>
                    <td className='p-3'>
                      <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>
                        {user.department}
                      </span>
                    </td>
                    <td className='p-3 text-right'>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setModalOpen(true);
                        }}
                        className='p-2 hover:bg-gray-200 rounded-lg'
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => alert('Delete user')}
                        className='p-2 hover:bg-gray-200 rounded-lg text-red-600'
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics & Activity */}
        <div className='grid gap-8 md:grid-cols-2'>
          {/* Analytics */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='bg-white/80 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg'
          >
            <h2 className='text-xl font-semibold flex items-center gap-2 mb-4 text-slate-800'>
              <TrendingUp className='text-purple-600' /> System Analytics
            </h2>
            <div className='h-56'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            '#3B82F6',
                            '#8B5CF6',
                            '#F59E0B',
                            '#10B981',
                            '#6366F1',
                          ][index % 5]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Live Activity */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='bg-white/80 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg flex flex-col'
          >
            <h2 className='text-xl font-semibold flex items-center gap-2 mb-4 text-slate-800'>
              <Activity className='text-green-600' /> Live Activity Feed
            </h2>
            <div className='space-y-3 overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
              {events.length > 0 ? (
                events.map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='text-sm flex gap-3 bg-white/70 p-3 rounded-lg border border-white/20 hover:bg-white/90 transition'
                  >
                    <Check
                      size={16}
                      className='text-green-500 mt-1'
                    />
                    <div>
                      <p className='font-medium text-slate-800'>
                        {event.message}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className='text-slate-500 text-sm'>No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {}}
        editingUser={editingUser}
      />
    </div>
  );
};

export default AdminDashboard;
