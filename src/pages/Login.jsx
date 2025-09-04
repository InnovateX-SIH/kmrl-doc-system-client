import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
         
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            })
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.role === 'Staff') {
                navigate('/dashboard'); 
            } else {
                navigate('/manager-dashboard'); 
            }

        } catch (err) {
            console.error('Login failed:', err.response?.data?.message);
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
    
    <div className='flex items-center justify-center min-h-screen bg-[#cce3e6]'>
      <div className='flex w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden'>
        <div className='w-1/2 bg-[#a7d5d9]  relative'>
          <img
            src='src/assets/view-3d-steam-engine-train.jpg'
            alt='3D Illustration'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='w-1/2 px-10 py-12'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>
            Login to Your Account
          </h2>

   
          <form
            onSubmit={handleLoginSubmit}
            className='space-y-6'
          >
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-600'
              >
                Email Address
              </label>
              <input
                id='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-[#a7d5d9] focus:outline-none'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-[#a7d5d9] focus:outline-none'
              />
            </div>

            {error && (
              <p className='text-sm text-center text-red-600'>{error}</p>
            )}

            <div>
              <button
                type='submit'
                className='w-full py-2 rounded-md bg-[#a7d5d9] text-white font-semibold hover:bg-[#8cc4c8] transition'
              >
                Login
              </button>
            </div>
            {/* <p className='text-sm text-gray-500 mt-6'>
              Create an account.{' '}
              <a
                href='/signup'
                className='text-[#6eaeb3] hover:underline'
              >
                Signup
              </a>
            </p> */}
          </form>
        </div>
      </div>
    </div>
    );

};

export default Login;