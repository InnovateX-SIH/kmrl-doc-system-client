import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set a flag in localStorage to indicate the user has seen the splash screen
        localStorage.setItem('hasVisited', 'true');

        // Wait for the video to finish (e.g., 5 seconds) then redirect to login
        const timer = setTimeout(() => {
            navigate('/login');
        }, 10000); // 5000 milliseconds = 5 seconds. Adjust to your video's length.

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#000' 
        }}>
            <video 
                autoPlay 
                muted 
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
                {/* The video is in the 'public' folder */}
                <source src="/KMRL_Synapse_Video_Generation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SplashScreen;