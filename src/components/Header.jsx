import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertsDropdown from './AlertsDropdown';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [showAlerts, setShowAlerts] = useState(false);

  const logoutHandler = () => {
    // 1. Remove user info from local storage
    localStorage.removeItem('userInfo');
    // 2. Redirect to the login page
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-8">
          {/* <Link to="/dashboard" className="text-xl font-bold hover:text-indigo-400">
            KMRL DocSystem
          </Link> */}
          <Link to={userInfo?.role === 'Staff' ? '/dashboard' : '/manager-dashboard'} className="text-xl font-bold ...">
    KMRL DocSystem
</Link>



          {userInfo?.role === 'Staff' && (
            <Link to="/assigned-documents" className="text-sm font-medium hover:text-indigo-400">
              Assigned to Me
            </Link>
          )}

<Link to="/profile" className="text-sm font-medium hover:text-indigo-400">
    My Profile
</Link>
          

          {(userInfo?.role === 'Manager' || userInfo?.role === 'Admin') && (
            <>
              <Link to="/approvals" className="text-sm font-medium hover:text-indigo-400">
                My Approvals
              </Link>

              <Link to="/approved-documents" className="text-sm font-medium hover:text-indigo-400">
                Approved Docs
              </Link>
            </>
          )}

          <Link to="/stats" className="text-sm font-medium hover:text-indigo-400">
            Analytics
          </Link>

          {userInfo?.role === 'Admin' && (
            <Link to="/create-user" className="text-sm font-medium hover:text-indigo-400">
              Create User
            </Link>
          )}


        </div>

        <div className="flex items-center space-x-4">
          {userInfo && <span className="text-gray-300">Welcome, {userInfo.name}</span>}

          <div className="relative">
            <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {/* We can add a notification count badge here later */}
            </button>
            {showAlerts && <AlertsDropdown />}
          </div>

          <button
            onClick={logoutHandler}
            className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;