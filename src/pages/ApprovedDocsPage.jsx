import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const ApprovedDocsPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW STATE FOR THE FORWARDING MODAL ---
    const [showModal, setShowModal] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [currentDocId, setCurrentDocId] = useState(null);

    useEffect(() => {
        const fetchApprovedDocs = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/documents/approved');
                setDocuments(data);
            } catch (err) {
                setError('Failed to fetch approved documents.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApprovedDocs();
    }, []);

    // --- NEW FUNCTIONS TO HANDLE THE MODAL ---
    const openForwardModal = async (docId) => {
        try {
            const { data } = await api.get('/users/staff');
            setStaffList(data);
            setCurrentDocId(docId);
            setSelectedStaff(''); // Reset selection
            setShowModal(true);
        } catch (err) {
            alert("Could not fetch the staff list.");
            console.error(err);
        }
    };

    const handleForward = async () => {
        if (!selectedStaff) {
            alert("Please select a staff member.");
            return;
        }
        try {
            await api.post(`/documents/${currentDocId}/forward`, { staffId: selectedStaff });
            alert("Document forwarded successfully!");
            setShowModal(false);
        } catch (err) {
            alert("Failed to forward the document.");
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Approved Documents</h1>
            {documents.length === 0 ? (
                <p className="text-gray-500">No documents have been approved yet.</p>
            ) : (
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div key={doc._id} className="p-4 bg-white border border-green-300 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                               <Link to={`/document/${doc._id}`} className="block hover:underline">
                                 <h3 className="font-semibold text-lg text-green-800">{doc.originalName}</h3>
                               </Link>
                               <p className="text-sm text-gray-600 mt-1">
                                   Uploaded by: {doc.uploadedBy.name} on {new Date(doc.createdAt).toLocaleDateString()}
                               </p>
                            </div>
                            {/* --- ADDED FORWARD BUTTON --- */}
                            <div>
                               <button 
                                 onClick={() => openForwardModal(doc._id)} 
                                 className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                               >
                                   Forward to Staff
                               </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- NEW FORWARD MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Forward Document</h2>
                        <label htmlFor="staff-select" className="block text-sm font-medium text-gray-700">Select a staff member to assign this document to:</label>
                        <select 
                            id="staff-select"
                            onChange={(e) => setSelectedStaff(e.target.value)} 
                            value={selectedStaff} 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>-- Select Staff --</option>
                            {staffList.map(staff => <option key={staff._id} value={staff._id}>{staff.name}</option>)}
                        </select>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button onClick={handleForward} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm & Forward</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovedDocsPage;