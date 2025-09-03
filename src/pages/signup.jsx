import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from refreshing the page
    setError(''); // Clear previous errors

    try {
      // 1. Make the API call to our backend
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem('userInfo', JSON.stringify(response.data));

      // 2. REDIRECT TO THE DASHBOARD
      navigate('/dashboard');

      // TODO: Save the token and redirect the user to the dashboard
    } catch (err) {
      // 3. If login fails, set an error message
      console.error('Login failed:', err.response.data.message);
      setError(
        err.response.data.message || 'An error occurred. Please try again.'
      );
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
            Create Account
          </h2>

          <div className='flex gap-4 mb-6'>
            <button className='flex items-center justify-center w-1/2 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50'>
              <img
                src='https://www.svgrepo.com/show/355037/google.svg'
                alt='Google'
                className='w-5 h-5 mr-2'
              />
              Sign up with Google
            </button>
            <button className='flex items-center justify-center w-1/2 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-50'>
              <img
                src='https://www.svgrepo.com/show/475647/facebook-color.svg'
                alt='Facebook'
                className='w-5 h-5 mr-2'
              />
              Sign up with Facebook
            </button>
          </div>

          <div className='flex items-center mb-6'>
            <div className='flex-grow border-t'></div>
            <span className='px-3 text-gray-400 text-sm'>OR</span>
            <div className='flex-grow border-t'></div>
          </div>

          <form onSubmit={handleSignupSubmit}>
            <div className='mb-4'>
              <input
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7d5d9]'
              />
            </div>
            <div className='mb-4'>
              <input
                type='email'
                placeholder='E-Mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7d5d9]'
              />
            </div>
            <div className='mb-6 relative'>
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7d5d9]'
              />
            </div>

            {error && (
              <p className='text-sm text-center text-red-600'>{error}</p>
            )}

            <button className='w-full py-2 rounded-md bg-[#a7d5d9] text-white font-semibold hover:bg-[#8cc4c8] transition'>
              Create Account
            </button>
          </form>

          <p className='text-sm text-gray-500 mt-6'>
            Already have an account?{' '}
            <a
              href='/login'
              className='text-[#6eaeb3] hover:underline'
            >
              Login in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
