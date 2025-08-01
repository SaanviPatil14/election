import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LockIcon from '../assets/icons/LockIcon';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const CommonLogin = () => {
  const [isVoter, setIsVoter] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  // Form states for Voter
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterPassword, setVoterPassword] = useState('');
  const [voterIdLogin, setVoterIdLogin] = useState('');

  // Form states for Candidate
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePassword, setCandidatePassword] = useState('');
  const [candidatePitch, setCandidatePitch] = useState('');
  const [candidateTagline, setCandidateTagline] = useState('');
  const [candidateIdLogin, setCandidateIdLogin] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVoterSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/voter/register', { name: voterName, email: voterEmail, password: voterPassword });
      setMessage(`Voter Registration Successful! Your Voter ID: ${res.data.voterId}. Please save it.`);
      setVoterName('');
      setVoterEmail('');
      setVoterPassword('');
      setIsLogin(true);
      setIsVoter(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Voter registration failed. Please try again.');
    }
  };

  const handleVoterLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/voter/login', { voterId: voterIdLogin, password: voterPassword });
      login(res.data.token, 'voter', { voterId: res.data.voterId, email: res.data.email });
      setMessage('Voter Login Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Voter login failed. Invalid Voter ID or password.');
    }
  };

  const handleCandidateSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/candidate/register', {
        name: candidateName,
        email: candidateEmail,
        password: candidatePassword,
        pitch: candidatePitch,
        tagline: candidateTagline,
      });
      setMessage(`Candidate Registration Successful! Your Candidate ID: ${res.data.candidateId}. Please save it. Admin approval is required.`);
      setCandidateName('');
      setCandidateEmail('');
      setCandidatePassword('');
      setCandidatePitch('');
      setCandidateTagline('');
      setIsLogin(true);
      setIsVoter(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Candidate registration failed. Please try again.');
    }
  };

  const handleCandidateLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/candidate/login', { candidateId: candidateIdLogin, password: candidatePassword });
      login(res.data.token, 'candidate', { candidateId: res.data.candidateId, email: res.data.email, isApproved: res.data.isApproved }); // Pass candidate data
      setMessage('Candidate Login Successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Candidate login failed. Invalid Candidate ID or password.');
    }
  };

  return (
    <div className="min-h-screen bg-light-grey flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-pastel-blue">
        <div className="flex justify-end mb-4">
          <Link to="/admin-login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-pastel-blue transition-colors duration-200">
            Admin Login
          </Link>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark-text">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Or ' : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              {isLogin ? 'register a new account' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8">
          <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-300">
            <button
              className={`flex-1 py-3 text-center text-lg font-semibold transition-all duration-300 ${
                isVoter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => { setIsVoter(true); setMessage(''); setError(''); }}
            >
              Voter
            </button>
            <button
              className={`flex-1 py-3 text-center text-lg font-semibold transition-all duration-300 ${
                !isVoter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => { setIsVoter(false); setMessage(''); setError(''); }}
            >
              Candidate
            </button>
          </div>

          {message && (
            <div className="bg-pastel-green border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
              {error}
            </div>
          )}

          {isVoter ? (
            // Voter Form
            isLogin ? (
              // Voter Login
              <form className="mt-8 space-y-6" onSubmit={handleVoterLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="voter-id-login" className="sr-only">Voter ID</label>
                    <div className="relative">
                      <input
                        id="voter-id-login"
                        name="voterId"
                        type="text"
                        autoComplete="off"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                        placeholder="Voter ID"
                        value={voterIdLogin}
                        onChange={(e) => setVoterIdLogin(e.target.value)}
                      />
                      <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="voter-password-login" className="sr-only">Password</label>
                    <div className="relative">
                      <input
                        id="voter-password-login"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={voterPassword}
                        onChange={(e) => setVoterPassword(e.target.value)}
                      />
                       <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockIcon className="h-5 w-5 text-blue-300 group-hover:text-white" aria-hidden="true" />
                    </span>
                    Sign In (Voter)
                  </button>
                </div>
              </form>
            ) : (
              // Voter Signup
              <form className="mt-8 space-y-6" onSubmit={handleVoterSignup}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="voter-name-signup" className="sr-only">Full Name</label>
                    <input
                      id="voter-name-signup"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                      placeholder="Full Name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="voter-email-signup" className="sr-only">Email address</label>
                    <input
                      id="voter-email-signup"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                      placeholder="Email address"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="voter-password-signup" className="sr-only">Password</label>
                    <div className="relative">
                      <input
                        id="voter-password-signup"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={voterPassword}
                        onChange={(e) => setVoterPassword(e.target.value)}
                      />
                       <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockIcon className="h-5 w-5 text-blue-300 group-hover:text-white" aria-hidden="true" />
                    </span>
                    Sign Up (Voter)
                  </button>
                </div>
              </form>
            )
          ) : (
            // Candidate Form
            isLogin ? (
              // Candidate Login
              <form className="mt-8 space-y-6" onSubmit={handleCandidateLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="candidate-id-login" className="sr-only">Candidate ID</label>
                    <div className="relative">
                      <input
                        id="candidate-id-login"
                        name="candidateId"
                        type="text"
                        autoComplete="off"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                        placeholder="Candidate ID"
                        value={candidateIdLogin}
                        onChange={(e) => setCandidateIdLogin(e.target.value)}
                      />
                      <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="candidate-password-login" className="sr-only">Password</label>
                    <div className="relative">
                      <input
                        id="candidate-password-login"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={candidatePassword}
                        onChange={(e) => setCandidatePassword(e.target.value)}
                      />
                      <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockIcon className="h-5 w-5 text-blue-300 group-hover:text-white" aria-hidden="true" />
                    </span>
                    Sign In (Candidate)
                  </button>
                </div>
              </form>
            ) : (
              // Candidate Signup
              <form className="mt-8 space-y-6" onSubmit={handleCandidateSignup}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="candidate-name-signup" className="sr-only">Full Name</label>
                    <input
                      id="candidate-name-signup"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                      placeholder="Full Name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>
                   <div>
                    <label htmlFor="candidate-email-signup" className="sr-only">Email address</label>
                    <input
                      id="candidate-email-signup"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                      placeholder="Email address"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="candidate-password-signup" className="sr-only">Password</label>
                    <div className="relative">
                      <input
                        id="candidate-password-signup"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                        placeholder="Password"
                        value={candidatePassword}
                        onChange={(e) => setCandidatePassword(e.target.value)}
                      />
                       <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="candidate-pitch-signup" className="sr-only">Pitch / Manifesto</label>
                    <textarea
                      id="candidate-pitch-signup"
                      name="pitch"
                      rows="4"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm mb-3"
                      placeholder="Your Pitch / Manifesto"
                      value={candidatePitch}
                      onChange={(e) => setCandidatePitch(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="candidate-tagline-signup" className="sr-only">Tagline</label>
                    <input
                      id="candidate-tagline-signup"
                      name="tagline"
                      type="text"
                      maxLength="100"
                      required
                      className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 focus:z-10 sm:text-sm"
                      placeholder="Tagline (max 100 characters)"
                      value={candidateTagline}
                      onChange={(e) => setCandidateTagline(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockIcon className="h-5 w-5 text-blue-300 group-hover:text-white" aria-hidden="true" />
                    </span>
                    Sign Up (Candidate)
                  </button>
                </div>
              </form>
            )
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <LockIcon className="inline-block h-4 w-4 mr-1 text-green-500" /> Your data is encrypted for security.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonLogin;