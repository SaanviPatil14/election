import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

const ElectionResults = () => {
  const [results, setResults] = useState([]);
  const [votingEnded, setVotingEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/results/current');
      setResults(res.data.candidates);
      setVotingEnded(res.data.votingEnded);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.response?.data?.message || 'Failed to fetch election results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-grey flex items-center justify-center">
        <p className="text-trust-blue text-lg animate-pulse">Loading election results...</p>
      </div>
    );
  }

  const title = "Official Election Results";
  const description = votingEnded
    ? "The polls have officially closed. View the final, verified results below."
    : "Live results from the ongoing election. Final results will be displayed after voting ends.";
  const Icon = votingEnded ? TrophyIcon : ChartBarIcon;
  const iconClass = votingEnded ? "h-9 w-9 mr-3 text-yellow-500" : "h-9 w-9 mr-3 text-green-600";

  return (
    <div className="min-h-screen bg-light-grey">
      <Navbar />
      <div className="container mx-auto p-6">
        
        {/* === INLINED HEADER COMPONENT === */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-dark-text mb-4 flex items-center justify-center">
            {Icon && <Icon className={iconClass} />}
            {title}
          </h1>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        {/* ================================= */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm animate-fade-in" role="alert">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-xl border border-pastel-blue text-center">
            <p className="text-xl text-gray-600 py-10">No candidates or votes recorded yet.</p>
            <p className="text-md text-gray-500">Check back after the election starts and votes are cast.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((candidate, index) => (
              <div
                key={candidate._id}
                className={`bg-white p-8 rounded-lg shadow-xl border-4 transform hover:scale-105 transition-transform duration-200 ease-in-out
                  ${votingEnded && index === 0 ? 'border-yellow-400' : 'border-pastel-blue'}`}
              >
                <div className="flex items-center mb-5">
                  <span className={`text-4xl font-extrabold mr-4 ${votingEnded && index === 0 ? 'text-yellow-500' : 'text-trust-blue'}`}>
                    {index + 1}.
                  </span>
                  <div>
                    <h2 className="text-3xl font-bold text-dark-text leading-tight">{candidate.name}</h2>
                    <p className="text-md text-gray-600 italic mt-1">{candidate.tagline}</p>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-lg text-gray-600 font-medium">Total Votes:</p>
                  <p className="text-6xl font-extrabold text-green-600 mt-2 animate-bounce-vote">{candidate.votes}</p>
                </div>
                {votingEnded && index === 0 && (
                  <div className="mt-4 text-center text-xl font-bold text-yellow-600 flex items-center justify-center">
                    <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
                    Winner!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionResults;