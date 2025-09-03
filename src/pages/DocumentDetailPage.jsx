import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const docResponse = await api.get(`/documents/${id}`);
            setDocument(docResponse.data);

            const ownerCheck = docResponse.data.uploadedBy === userInfo._id;
            setIsOwner(ownerCheck);
            
            if (ownerCheck && docResponse.data.approvalStatus === 'Not Requested') {
                const managersResponse = await api.get('/users/managers');
                setManagers(managersResponse.data);
            }
        } catch (err) {
            setError('Failed to fetch details.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleRequestApproval = async () => {
        if (!selectedManager) {
            alert('Please select a manager.');
            return;
        }
        try {
            await api.post(`/documents/${id}/request-approval`, { managerId: selectedManager });
            alert('Approval requested successfully!');
            fetchDetails(); // Re-fetch data to show the new 'Pending' status
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to request approval.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!document) return <div className="p-8 text-center">Document not found.</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Link to="/dashboard" className="text-indigo-600 hover:underline mb-6 block">
                &larr; Back to Dashboard
            </Link>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">{document.originalName}</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Processing Status:</strong> {document.status}</p>
                    <p><strong>File Type:</strong> {document.fileType}</p>
                    <p><strong>Uploaded At:</strong> {new Date(document.createdAt).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(document.updatedAt).toLocaleString()}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                        {document.summary || 'No summary available yet.'}
                    </p>
                </div>
            </div>

            {isOwner && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold">Approval Status</h2>
                    
                    {document.approvalStatus === 'Not Requested' ? (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Send this document to a manager for approval.</p>
                            <label htmlFor="manager-select" className="block text-sm font-medium text-gray-700 mt-4">
                                Select a Manager
                            </label>
                            <select
                                id="manager-select"
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="" disabled>-- Choose a manager --</option>
                                {managers.map(manager => (
                                    <option key={manager._id} value={manager._id}>{manager.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleRequestApproval}
                                className="mt-4 w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Send Request
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <p className={`inline-flex items-center px-3 py-1 text-base font-medium rounded-full ${
                                document.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 
                                document.approvalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {document.approvalStatus}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentDetailPage;