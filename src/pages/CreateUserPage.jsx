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
      await api.post('/users/create', {
        name,
        email,
        password,
        role,
        department,
      });
      setSuccess(`User "${name}" created successfully!`);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <div className='p-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <div className='w-full max-w-lg bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-indigo-100'>
        <h1 className='text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent'>
          ✨ Create New User
        </h1>

        <form
          onSubmit={handleSubmit}
          className='mt-8 space-y-5'
        >
          {/* Full Name */}
          <div>
            <label className='block text-sm font-medium text-indigo-700'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Enter full name'
              className='mt-1 w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/70 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-indigo-700'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter email address'
              className='mt-1 w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/70 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-indigo-700'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength='6'
              placeholder='Enter password'
              className='mt-1 w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/70 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition'
            />
          </div>

          {/* Role */}
          <div>
            <label className='block text-sm font-medium text-indigo-700'>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='mt-1 w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/70 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition'
            >
              <option value='Staff'>Staff</option>
              <option value='Manager'>Manager</option>
              <option value='Admin'>Admin</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className='block text-sm font-medium text-indigo-700'>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className='mt-1 w-full px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50/70 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition'
            >
              <option value='General'>General</option>
              <option value='Engineering'>Engineering</option>
              <option value='Procurement'>Procurement</option>
              <option value='HR'>HR</option>
              <option value='Finance'>Finance</option>
              <option value='Safety'>Safety</option>
            </select>
          </div>

          {/* Messages */}
          {error && (
            <p className='text-red-600 text-sm text-center bg-red-50 p-2 rounded-md'>
              {error}
            </p>
          )}
          {success && (
            <p className='text-green-600 text-sm text-center bg-green-50 p-2 rounded-md'>
              {success}
            </p>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-pink-600 transition'
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
