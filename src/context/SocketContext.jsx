import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (userInfo?._id) {
            // Establish the connection
            socket.current = io('http://localhost:5000');

            // Join the private room once connected
            socket.current.on('connect', () => {
                console.log('Socket connected! Emitting join_room.');
                socket.current.emit('join_room', userInfo._id);
            });

            // Listen for new alerts
            socket.current.on('new_alert', (alert) => {
                console.log('New alert received:', alert);
                toast.info(alert.message, {
                    position: "bottom-right",
                });
            });

            // Handle connection errors
            socket.current.on('connect_error', (err) => {
                console.error("Socket connection error:", err.message);
            });
        }

        // Cleanup on logout/unmount
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [userInfo?._id]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};