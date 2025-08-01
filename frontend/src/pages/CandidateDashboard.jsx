// frontend/src/pages/CandidateDashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { UserCircleIcon, PencilSquareIcon, CheckIcon, XMarkIcon, ClockIcon, MinusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CandidateDashboard = () => {
  const { user, setUser } = useAuth();
  const [candidateData, setCandidateData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPitch, setEditPitch] = useState('');
  const [editTagline, setEditTagline] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const res = await api.get('/candidates/me');
        setCandidateData(res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError(err.response?.data?.message || 'Failed to fetch candidate data.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userType === 'candidate') {
      fetchCandidateData();
    } else {
        setLoading(false);
    }
  }, [user?.id, user?.userType, setUser]);

  // --- NEW HANDLERS ---
  const handleEdit = () => {
    setEditPitch(candidateData.pitch);
    setEditTagline(candidateData.tagline);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPitch('');
    setEditTagline('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.put('/candidates/me', {
        pitch: editPitch,
        tagline: editTagline,
      });
      // Update the state with the new data
      setCandidateData(res.data.candidate);
      setUser(res.data.candidate); // Also update the global auth context
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-light-grey flex items-center justify-center">
            <p className="text-trust-blue text-lg">Loading candidate data...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-light-grey flex items-center justify-center">
            <p className="text-red-600 text-lg">{error}</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-grey">
      <Navbar />
      <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Welcome, {user?.name || user?.email || user?.candidateId}!</h1>
      <p className="text-lg text-dark-text mb-4">This is your Voter Dashboard. Your voice matters!</p>
        
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

        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold text-dark-text">Your Profile Status</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-trust-blue text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center"
              >
                <PencilSquareIcon className="h-5 w-5 mr-1" />
                Edit Profile
              </button>
            )}
          </div>

          {candidateData?.isApproved ? (
            <div className="flex items-center text-green-700 font-semibold text-xl border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-md">
              <CheckCircleIcon className="h-8 w-8 mr-3" />
              Your candidacy has been <span className="font-extrabold ml-1">APPROVED</span> by the admin.
            </div>
          ) : candidateData?.isRejected ? (
            <div className="flex items-center text-red-700 font-semibold text-xl border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-md">
              <MinusCircleIcon className="h-8 w-8 mr-3" />
              Your candidacy has been <span className="font-extrabold ml-1">REJECTED</span> by the admin. You are not eligible to run in this election.
            </div>
          ) : (
            <div className="flex items-center text-orange-700 font-semibold text-xl border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-md">
              <ClockIcon className="h-8 w-8 mr-3" />
              Your candidacy is <span className="font-extrabold ml-1">PENDING APPROVAL</span>. Please wait for the admin to review.
            </div>
          )}

          <div className="mt-6">
            <p className="text-gray-800 text-base"><strong>Email:</strong> {candidateData?.email}</p>
            <p className="text-gray-800 text-base mt-2"><strong>Candidate ID:</strong> {candidateData?.candidateId}</p>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="text-gray-700 text-base font-semibold block mb-1">Pitch</label>
              {isEditing ? (
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-trust-blue focus:border-trust-blue transition-colors duration-200"
                  value={editPitch}
                  onChange={(e) => setEditPitch(e.target.value)}
                  rows="4"
                  required
                />
              ) : (
                <p className="text-gray-700 text-base italic leading-relaxed">"{candidateData?.pitch}"</p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-base font-semibold block mb-1">Tagline</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-trust-blue focus:border-trust-blue transition-colors duration-200"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  maxLength="100"
                  required
                />
              ) : (
                <p className="text-gray-700 text-base font-semibold">"{candidateData?.tagline}"</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-sm font-medium flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 mr-1" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue">
          <h2 className="text-3xl font-bold text-dark-text mb-5">Your Current Vote Count</h2>
          <div className="flex items-center justify-center">
            <span className="text-7xl font-extrabold text-trust-blue animate-pulse-slow">
              {candidateData?.votes !== undefined ? candidateData.votes : '0'}
            </span>
            <span className="text-3xl font-semibold text-gray-600 ml-4">Votes</span>
          </div>
          <p className="text-center text-gray-600 mt-4 text-base">
            This count reflects the votes received so far. Final results will be announced after the election officially ends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;