import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AssignedDocsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignedDocs = async () => {
            try {
                const { data } = await api.get('/alerts/assigned');
                // Filter out any assignments where the document might have been deleted
                setAssignments(data.filter(item => item.document));
            } finally {
                setLoading(false);
            }
        };
        fetchAssignedDocs();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Documents Assigned to Me</h1>
            {assignments.length === 0 ? (
                <p className="text-gray-500">No documents are currently assigned to you.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map((item) => (
                        <div key={item._id} className="p-4 bg-white border rounded-lg shadow-sm">
                           <Link to={`/document/${item.document._id}`} className="block hover:underline">
                             <h3 className="font-semibold text-lg">{item.document.originalName}</h3>
                           </Link>
                           <p className="text-sm text-gray-600 mt-1 italic">"{item.message}"</p>
                           <p className="text-xs text-gray-400 mt-2">Assigned on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedDocsPage;