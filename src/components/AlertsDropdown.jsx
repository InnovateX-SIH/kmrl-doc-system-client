import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AlertsDropdown = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await api.get('/alerts');
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border">
            <div className="p-4 font-bold border-b">Notifications</div>
            <ul className="py-1">
                {alerts.length === 0 ? (
                    <li className="px-4 py-2 text-sm text-gray-500">No new notifications</li>
                ) : (
                    alerts.map(alert => (
                        <li key={alert._id}>
                            <Link to={alert.link || '#'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {alert.message}
                                <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AlertsDropdown;