import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
import { Clock4 } from 'lucide-react';
import moment from 'moment';

const ApprovedDocsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- MODAL STATES ---
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

  const openForwardModal = async (docId) => {
    try {
      const { data } = await api.get('/users/staff');
      setStaffList(data);
      setCurrentDocId(docId);
      setSelectedStaff('');
      setShowModal(true);
    } catch (err) {
      alert('Could not fetch the staff list.');
      console.error(err);
    }
  };

  const handleForward = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member.');
      return;
    }
    try {
      await api.post(`/documents/${currentDocId}/forward`, {
        staffId: selectedStaff,
      });
      alert('Document forwarded successfully!');
      setShowModal(false);
    } catch (err) {
      alert('Failed to forward the document.');
      console.error(err);
    }
  };

  if (loading) return <div className='p-8 text-center'>Loading...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      <div className='main-dash p-8 w-[70%] mx-auto'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight mb-6'>
          Approved Documents
        </h1>

        {documents.length === 0 ? (
          <div className='mt-8 p-8 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg'>
            <p className='text-slate-600 text-center'>
              No documents have been approved yet.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {documents.map((doc) => (
              <Motion.div
                key={doc._id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className='block hover:shadow-xl transition-all duration-200'
              >
                <div className='flex w-full items-center justify-between p-6 gap-[20px] bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:bg-white/90 hover:border-blue-200'>
                  <div className='flex flex-col w-[85%] gap-[8px]'>
                    <Link
                      to={`/document/${doc._id}`}
                      className='hover:underline'
                    >
                      <h3 className='font-semibold text-lg text-slate-800'>
                        {doc.originalName}
                      </h3>
                    </Link>
                    <p className='text-sm text-slate-600'>
                      Uploaded by:{' '}
                      <span className='font-medium'>
                        {doc.uploadedBy?.name}
                      </span>
                    </p>
                    <div className='flex items-center gap-2 text-sm text-slate-500'>
                      <Clock4 size={15} />
                      {moment(doc.createdAt).format('MMMM Do YYYY, h:mm A')}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => openForwardModal(doc._id)}
                      className='px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-400 to-blue-400 
               rounded-lg hover:from-indigo-500 hover:to-blue-500 
               shadow-md hover:shadow-lg transition-all duration-200'
                    >
                      Forward
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}

        {/* --- MODAL --- */}
        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Forward Document</h2>
              <label
                htmlFor='staff-select'
                className='block text-sm font-medium text-gray-700'
              >
                Select a staff member:
              </label>
              <select
                id='staff-select'
                onChange={(e) => setSelectedStaff(e.target.value)}
                value={selectedStaff}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
              >
                <option
                  value=''
                  disabled
                >
                  -- Select Staff --
                </option>
                {staffList.map((staff) => (
                  <option
                    key={staff._id}
                    value={staff._id}
                  >
                    {staff.name}
                  </option>
                ))}
              </select>
              <div className='mt-6 flex justify-end space-x-2'>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleForward}
                  className='px-4 py-2 font-medium text-white bg-gradient-to-r from-indigo-400 to-blue-400 
               rounded-lg hover:from-indigo-500 hover:to-blue-500 
               shadow-md hover:shadow-lg transition-all duration-200'
                >
                  Confirm & Forward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedDocsPage;
