import React, { useState, useEffect } from 'react';
import SplashScreen from './components/splashscreen.jsx';
import Login from './pages/Login';

const LoginWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
  
    const timer = setTimeout(() => setShowSplash(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <Login />;
};

export default LoginWrapper;
