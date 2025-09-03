import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    // We no longer need to send the managerId!
    formData.append('documentFile', selectedFile);

    try {
      await api.post('/documents/upload', formData);
      alert('File uploaded and sent for approval!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Upload Document</h1>
      <p className="text-gray-600 mt-2">Your document will be automatically sent to your department's manager for approval.</p>
      <form onSubmit={handleUpload} className="mt-6 p-6 bg-white ...">
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Choose a file to upload
            </label>
            <input
              id="file-upload"
              type="file"
              required
              onChange={handleFileChange}
              className="mt-1 block w-full ..."
            />
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="w-full px-4 py-2 font-medium ..."
          >
            {uploading ? 'Uploading...' : 'Upload & Send for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;