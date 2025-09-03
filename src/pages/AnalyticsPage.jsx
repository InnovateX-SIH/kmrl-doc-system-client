import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/documents/stats');
                
                // Format the data for Chart.js
                const formattedData = {
                    // --- THIS IS THE FIX ---
                    // Use the 'category' field from the backend, not '_id'
                    labels: data.map(item => item.category), 
                    datasets: [{
                        label: '# of Documents',
                        data: data.map(item => item.count),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                        ],
                    }]
                };
                setChartData(formattedData);
            } catch (err) {
                setError("Failed to fetch analytics data.");
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Analytics</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Documents by Category</h2>
                {chartData && chartData.labels.length > 0 ? (
                    <div style={{maxWidth: '400px', margin: 'auto'}}>
                        <Pie data={chartData} />
                    </div>
                ) : (
                    <p>No classified documents available to display.</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;