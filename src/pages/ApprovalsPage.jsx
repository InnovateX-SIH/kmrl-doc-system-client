import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const ApprovalsPage = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [managers, setManagers] = useState([]); // Keep state for the forward feature

    // A single function to fetch all necessary data
    const fetchData = async () => {
        try {
            const [approvalsRes, managersRes] = await Promise.all([
                api.get('/approvals'),
                api.get('/users/managers')
            ]);
            setApprovals(approvalsRes.data);
            setManagers(managersRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        }
    };

    useEffect(() => {
        // Initial fetch with loading indicator
        const initialFetch = async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        };
        initialFetch();

        // Set up interval for silent background refresh
        const intervalId = setInterval(fetchData, 3000); // Refresh every 3 seconds

        // Cleanup
        return () => clearInterval(intervalId);
    }, []);

    const handleDecision = async (approvalId, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this document?`)) {
            return;
        }
        try {
            await api.put(`/approvals/${approvalId}/decision`, { status });
            alert(`Request has been ${status.toLowerCase()}!`);
            // Remove the item from the list immediately for instant feedback
            setApprovals(prev => prev.filter(app => app._id !== approvalId));
        } catch (err) {
            alert('Failed to process the request.');
            console.error(err);
        }
    };

    const handleForward = async (approvalId) => {
        const currentUserId = JSON.parse(localStorage.getItem('userInfo'))._id;
        const otherManagers = managers.filter(m => m._id !== currentUserId);

        if (otherManagers.length === 0) {
            alert("No other managers available to forward to.");
            return;
        }
        
        // A simple way to create a selection prompt
        const choice = prompt(
            "Select a manager to forward this to:\n\n" +
            otherManagers.map((m, i) => `${i + 1}. ${m.name}`).join("\n")
        );
        const selectionIndex = parseInt(choice) - 1;

        if (choice && otherManagers[selectionIndex]) {
            const selectedManager = otherManagers[selectionIndex];
            try {
                await api.put(`/approvals/${approvalId}/forward`, { newApproverId: selectedManager._id });
                alert('Request forwarded successfully!');
                // Remove from this manager's list for instant feedback
                setApprovals(prev => prev.filter(app => app._id !== approvalId));
            } catch (err) {
                alert('Failed to forward the request.');
                console.error(err);
            }
        } else if (choice !== null) { // Handle invalid number
            alert("Invalid selection.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading approval requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Approvals</h1>
            {approvals.length === 0 ? (
                <p className="text-gray-500">You have no pending approval requests.</p>
            ) : (
                <div className="space-y-4">
                    {approvals.map((approval) => (
                        <div key={approval._id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        <Link to={`/document/${approval.document._id}`} className="hover:underline">
                                            {approval.document.originalName}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Requested by: {approval.requester.name} ({approval.requester.email})
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDecision(approval._id, 'Approved')}
                                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleDecision(approval._id, 'Rejected')}
                                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleForward(approval._id)}
                                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Forward
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalsPage;