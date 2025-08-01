// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShieldCheckIcon, MinusCircleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import LockIcon from '../assets/icons/LockIcon';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [votingStartTime, setVotingStartTime] = useState('');
  const [votingEndTime, setVotingEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // This function fetches all candidates and separates them into the correct lists
  const fetchCandidates = async () => {
    try {
      const res = await api.get('/admin/candidates');
      const allCandidates = res.data;
      
      setPendingCandidates(allCandidates.filter(c => !c.isApproved && !c.isRejected));
      setApprovedCandidates(allCandidates.filter(c => c.isApproved));
      setRejectedCandidates(allCandidates.filter(c => c.isRejected));
      
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err.response?.data?.message || 'Failed to fetch candidates.');
    }
  };

  const fetchVotingTimings = async () => {
    try {
      const res = await api.get('/admin/voting-timings');
      if (res.data.votingStartTime) {
        setVotingStartTime(new Date(res.data.votingStartTime).toISOString().slice(0, 16));
      } else {
          setVotingStartTime('');
      }
      if (res.data.votingEndTime) {
        setVotingEndTime(new Date(res.data.votingEndTime).toISOString().slice(0, 16));
      } else {
          setVotingEndTime('');
      }
    } catch (err) {
      console.error('Error fetching voting timings:', err.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCandidates();
    fetchVotingTimings();
  }, []);

  const handleApproveCandidate = async (candidateId) => {
    try {
      setMessage('');
      setError('');
      await api.put(`/admin/candidates/${candidateId}/approve`);
      setMessage('Candidate approved successfully!');
      
      // Re-fetch all candidate data to ensure lists are fresh
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve candidate.');
    }
  };

  const handleRejectCandidate = async (candidateId) => {
    try {
      setMessage('');
      setError('');
      await api.put(`/admin/candidates/${candidateId}/reject`);
      setMessage('Candidate rejected successfully!');
      
      // Re-fetch all candidate data to ensure lists are fresh
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject candidate.');
    }
  };

  const handleSetVotingTimings = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!votingStartTime || !votingEndTime) {
        setError('Both start and end times are required.');
        return;
    }
    const start = new Date(votingStartTime);
    const end = new Date(votingEndTime);

    if (end <= start) {
        setError('End time must be after start time.');
        return;
    }

    try {
      await api.post('/admin/set-voting-timings', {
        startTime: votingStartTime,
        endTime: votingEndTime,
      });
      setMessage('Voting timings set successfully!');
      fetchVotingTimings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set voting timings.');
    }
  };

  return (
    <div className="min-h-screen bg-light-grey">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 flex items-center">
          Admin Dashboard <LockIcon className="ml-2 h-8 w-8 text-green-500" />
        </h1>
        <p className="text-lg text-dark-text mb-4">Manage candidates and election settings.</p>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 text-sm font-medium animate-fade-in" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm animate-fade-in" role="alert">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <Link
                to="/election-results"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-base font-medium flex items-center shadow-md hover:shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                View Election Results
            </Link>
        </div>


        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue mb-8">
          <h2 className="text-3xl font-bold text-dark-text mb-5">Set Voting Timings</h2>
          <form onSubmit={handleSetVotingTimings} className="space-y-5">
            <div>
              <label htmlFor="startTime" className="block text-md font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue text-base"
                value={votingStartTime}
                onChange={(e) => setVotingStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-md font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-trust-blue focus:border-trust-blue text-base"
                value={votingEndTime}
                onChange={(e) => setVotingEndTime(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-trust-blue text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg"
            >
              Set Timings
            </button>
          </form>
        </div>


        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue mb-8">
          <h2 className="text-3xl font-bold text-dark-text mb-5">Pending Candidate Approvals</h2>
          {pendingCandidates.length === 0 ? (
            <p className="text-xl text-gray-600 text-center py-10">🎉 No pending candidates. All clear!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingCandidates.map((candidate) => (
                <li key={candidate._id} className="py-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xl font-medium text-dark-text">{candidate.name} ({candidate.candidateId})</p>
                    <p className="text-md text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-500 italic mt-1">"{candidate.tagline}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveCandidate(candidate._id)}
                      className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-md font-medium shadow-sm hover:shadow-md flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectCandidate(candidate._id)}
                      className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-md font-medium shadow-sm hover:shadow-md flex items-center"
                    >
                      <MinusCircleIcon className="h-5 w-5 mr-1" />
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue mb-8">
          <h2 className="text-3xl font-bold text-dark-text mb-5">Approved Candidates</h2>
          {approvedCandidates.length === 0 ? (
            <p className="text-xl text-gray-600 text-center py-10">No approved candidates yet. Approve some to get started!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {approvedCandidates.map((candidate) => (
                <li key={candidate._id} className="py-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xl font-medium text-dark-text">{candidate.name} ({candidate.candidateId})</p>
                    <p className="text-md text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-500 italic mt-1">"{candidate.tagline}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectCandidate(candidate._id)}
                      className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-md font-medium shadow-sm hover:shadow-md flex items-center"
                    >
                      <MinusCircleIcon className="h-5 w-5 mr-1" />
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue">
          <h2 className="text-3xl font-bold text-dark-text mb-5">Rejected Candidates</h2>
          {rejectedCandidates.length === 0 ? (
            <p className="text-xl text-gray-600 text-center py-10">No candidates have been rejected.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rejectedCandidates.map((candidate) => (
                <li key={candidate._id} className="py-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xl font-medium text-dark-text">{candidate.name} ({candidate.candidateId})</p>
                    <p className="text-md text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-500 italic mt-1">"{candidate.tagline}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveCandidate(candidate._id)}
                      className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-md font-medium shadow-sm hover:shadow-md flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      Approve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

