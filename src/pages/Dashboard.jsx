import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true); // For the initial load only
    const [error, setError] = useState('');

    useEffect(() => {
        // Function for the very first data load
        const initialFetch = async () => {
            try {
                setLoading(true);
                const response = await api.get('/documents');
                setDocuments(response.data);
            } catch (err) {
                setError('Failed to fetch documents.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Function for silent background refreshes
        const refreshDocuments = async () => {
            try {
                const response = await api.get('/documents');
                setDocuments(response.data);
            } catch (err) {
                console.error("Background refresh failed:", err);
            }
        };

        initialFetch(); // Fetch data immediately on page load

        // Set up the interval for silent refreshing every 2 seconds
        const intervalId = setInterval(refreshDocuments, 2000);

        // Cleanup function to stop the interval when you leave the page
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading documents...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
                {userInfo?.role === 'Staff' && (
                    <Link 
                        to="/upload" 
                        className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        + Upload New Document
                    </Link>
                )}
            </div>
            
            {documents.length === 0 ? (
                <p className="mt-4 text-gray-500">You haven't uploaded any documents yet.</p>
            ) : (
                <div className="mt-6 space-y-4">
                    {documents.map((doc) => (
                        <Link key={doc._id} to={`/document/${doc._id}`} className="block hover:bg-gray-50">
                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg text-gray-900">{doc.originalName}</h3>
                                <div className="flex items-center space-x-4 mt-2">
                                    <p className="text-sm text-gray-600">Status: 
                                        <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${
                                            doc.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                            doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {doc.status}
                                        </span>
                                    </p>
                                    {doc.approvalStatus && doc.approvalStatus !== 'Not Requested' && (
                                        <p className="text-sm text-gray-600">Approval: 
                                            <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                doc.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                doc.approvalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {doc.approvalStatus}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;