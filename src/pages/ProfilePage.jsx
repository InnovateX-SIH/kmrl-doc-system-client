import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, historyRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/users/history')
                ]);
                setProfile(profileRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Profile...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            {profile && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Department:</strong> {profile.department}</p>
                </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity History</h2>
            <div className="space-y-4">
                {history.map((event, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                        {event.type === 'UPLOAD' && (
                            <p>You uploaded the document: <Link to={`/document/${event.item._id}`} className="font-semibold text-indigo-600">{event.item.originalName}</Link></p>
                        )}
                        {event.type === 'APPROVAL' && (
                            <p>Approval status for "{event.item.document?.originalName}" was updated to <strong>{event.item.status}</strong>.</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{new Date(event.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;