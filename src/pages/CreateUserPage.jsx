import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Staff');
    const [department, setDepartment] = useState('General');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/users/create', { name, email, password, role, department });
            setSuccess(`User "${name}" created successfully!`);
            // Clear the form
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user.');
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">Create New User</h1>
            <form onSubmit={handleSubmit} className="mt-6 p-6 bg-white rounded-lg shadow-md space-y-4">
                {/* --- ADDED NAME FIELD --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>

                {/* --- ADDED EMAIL FIELD --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                
                {/* --- ADDED PASSWORD FIELD --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="Staff">Staff</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="General">General</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Procurement">Procurement</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Safety">Safety</option>
                    </select>
                </div>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}

                <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Create User</button>
            </form>
        </div>
    );
};

export default CreateUserPage;