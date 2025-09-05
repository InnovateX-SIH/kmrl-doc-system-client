import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Clock, Hourglass, Search, Plus, Edit, Trash2, UserPlus, Check, ArrowRight, Shield, TrendingUp, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/api';

// --- HELPER COMPONENTS (can be moved to their own files) ---

const Avatar = ({ name }) => (
    <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        <span className="select-none text-sm font-semibold text-gray-700">
            {name.split(" ").map((n) => n[0]).join("")}
        </span>
    </div>
);

const UserModal = ({ open, onClose, onSave, editingUser }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Staff");
    const [department, setDepartment] = useState("General");

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name);
            setEmail(editingUser.email);
            setRole(editingUser.role);
            setDepartment(editingUser.department);
        } else {
            setName(""); setEmail(""); setRole("Staff"); setDepartment("General");
        }
    }, [editingUser, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        onSave({ _id: editingUser?._id, name, email, role, department });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-black/50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div 
                className="relative z-10 w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            >
                <h3 className="text-lg font-semibold mb-4">{editingUser ? "Edit User" : "Add New User"}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields for name, email, role, department */}
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full p-2 border rounded-md" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full p-2 border rounded-md" />
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded-md">
                        <option value="Staff">Staff</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full p-2 border rounded-md">
                        <option value="General">General</option><option value="Engineering">Engineering</option><option value="HR">HR</option>
                        <option value="Finance">Finance</option><option value="Safety">Safety</option><option value="Procurement">Procurement</option>
                    </select>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{editingUser ? "Save Changes" : "Create User"}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


// --- MAIN ADMIN DASHBOARD COMPONENT ---

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalDocs: 0, pending: 0, avgTime: "N/A" });
    const [chartData, setChartData] = useState([]);
    const [events, setEvents] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes, alertsRes] = await Promise.all([
                api.get('/users'), // Fetches all users
                api.get('/documents/stats'), // Your existing stats endpoint
                api.get('/alerts') // Your existing alerts endpoint
            ]);
            setUsers(usersRes.data);
            const chartFormatted = statsRes.data.map(item => ({ name: item.category, value: item.count }));
            setChartData(chartFormatted);
            setEvents(alertsRes.data.slice(0, 5)); // Show latest 5 events
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
            return matchesSearch && matchesRole && matchesDepartment;
        });
    }, [users, searchTerm, roleFilter, departmentFilter]);

    const handleSaveUser = async (userData) => {
        try {
            if (userData._id) { // Editing existing user
                await api.put(`/users/${userData._id}`, userData);
            } else { // Creating new user
                await api.post('/users/create', { ...userData, password: 'password123' }); // Default password
            }
            setModalOpen(false);
            fetchData(); // Refresh all data
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${userId}`);
                fetchData(); // Refresh all data
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    const openCreateModal = () => { setEditingUser(null); setModalOpen(true); };
    const openEditModal = (user) => { setEditingUser(user); setModalOpen(true); };

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Administrator Control Tower</h1>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                {/* Column 1: User Administration */}
                <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2"><Users className="text-blue-600" /> User Administration</h2>
                        <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
                            <span className="flex items-center gap-2"><Plus size={16} /> Add User</span>
                        </button>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search users..." className="flex-1 p-2 border rounded-md" />
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="p-2 border rounded-md">
                            <option value="all">All Roles</option><option value="Admin">Admin</option><option value="Manager">Manager</option><option value="Staff">Staff</option>
                        </select>
                        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="p-2 border rounded-md">
                            <option value="all">All Departments</option><option value="General">General</option><option value="Engineering">Engineering</option><option value="HR">HR</option>
                            <option value="Finance">Finance</option><option value="Safety">Safety</option><option value="Procurement">Procurement</option>
                        </select>
                    </div>
                    {/* User Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Department</th><th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 flex items-center gap-3">
                                            <Avatar name={user.name} />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-3"><span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{user.role}</span></td>
                                        <td className="p-3"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{user.department}</span></td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => openEditModal(user)} className="p-1 hover:bg-gray-200 rounded"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteUser(user._id)} className="p-1 hover:bg-gray-200 rounded text-red-600"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Column 2: Analytics & Activity */}
               <div className="grid gap-8 md:grid-cols-2">
      {/* System Analytics */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="text-purple-600" /> System Analytics
        </h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={[
                      "#3B82F6",
                      "#8B5CF6",
                      "#F59E0B",
                      "#10B981",
                      "#6366F1",
                    ][index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Activity className="text-green-600" /> Live Activity Feed
        </h2>
        <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-96">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm flex gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="mt-1">
                  <Check size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{event.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No recent activity</p>
          )}
        </div>
      </motion.div>
    </div>
            </div>
            
            <UserModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveUser} editingUser={editingUser} />
        </div>
    );
};

export default AdminDashboard;