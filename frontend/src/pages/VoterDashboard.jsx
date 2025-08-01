// frontend/src/pages/VoterDashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const VoterDashboard = () => {
  const { user, setUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.hasVoted) {
      setMessage('You have already cast your vote.');
      return;
    }
    fetchVotingInfo();
  }, [user]);

  const fetchVotingInfo = async () => {
    setError('');
    setMessage('');
    try {
      const timingRes = await api.get('/results/voting-status');
      const { votingStartTime, votingEndTime } = timingRes.data;
      const now = new Date();
      let status = '';
      if (!votingStartTime || !votingEndTime) {
        status = 'not_set';
      } else if (now < new Date(votingStartTime)) {
        status = 'not_started';
        setMessage(`Voting starts on ${new Date(votingStartTime).toLocaleString()}.`);
      } else if (now > new Date(votingEndTime)) {
        status = 'closed';
        setMessage(`Voting has ended as of ${new Date(votingEndTime).toLocaleString()}.`);
      } else {
        status = 'open';
        setMessage('Voting is currently open! Cast your vote now.');
        // If voting is open, fetch candidates
        const candidateRes = await api.get('/voters/candidates');
        setCandidates(candidateRes.data);
      }
      setVotingStatus(status);

    } catch (err) {
      console.error('Error fetching voting info:', err);
      setError(err.response?.data?.message || 'Failed to fetch voting information.');
      setVotingStatus('error');
    }
  };

  const handleVote = async (candidateId) => {
    if (user?.hasVoted) {
      setError('You have already cast your vote.');
      return;
    }
    if (votingStatus !== 'open') {
        setError('Voting is not currently open.');
        return;
    }

    try {
      setMessage('');
      setError('');
      await api.post(`/voters/vote/${candidateId}`);
      setMessage('Your vote has been cast successfully!');
      setUser({ ...user, hasVoted: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.');
    }
  };

  return (
    <div className="min-h-screen bg-light-grey">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Welcome, {user?.name || user?.email || user?.voterId}!</h1>
        <p className="text-lg text-dark-text mb-4">This is your Voter Dashboard. Your voice matters!</p>

        {message && (
          <div className={`px-4 py-3 rounded-md mb-4 text-sm ${user?.hasVoted || votingStatus === 'closed' ? 'bg-pastel-blue border border-blue-400 text-blue-700' : 'bg-pastel-green border border-green-400 text-green-700'}`} role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md border border-pastel-blue mb-8">
          <h2 className="text-2xl font-semibold text-dark-text mb-4">Candidates for Election</h2>
          {user?.hasVoted ? (
            <p className="text-gray-700 font-medium">You have already cast your vote. Thank you for participating!</p>
          ) : votingStatus === 'open' ? (
            candidates.length === 0 ? (
              <p className="text-gray-600">No approved candidates available for voting yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <div key={candidate._id} className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-dark-text">{candidate.name}</h3>
                      <p className="text-sm text-gray-500 italic mb-2">"{candidate.tagline}"</p>
                      <p className="text-gray-700 text-sm">{candidate.pitch.substring(0, 150)}...</p> {/* Truncate pitch */}
                    </div>
                    <button
                      onClick={() => handleVote(candidate._id)}
                      disabled={user?.hasVoted} // Disable if already voted
                      className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
                        user?.hasVoted
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {user?.hasVoted ? 'Voted' : 'Vote for ' + candidate.name}
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-gray-600">Voting is {votingStatus === 'not_started' ? 'not yet open' : votingStatus === 'closed' ? 'closed' : 'unavailable'}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;