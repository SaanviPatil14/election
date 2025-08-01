import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion, useAnimation } from 'framer-motion';
import {
  ShieldCheck,
  BarChart3,
  Lock,
  CheckCircle,
  Globe,
  Users,
  Zap,
  Eye,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    title: 'Blockchain Security',
    description: 'Votes are encrypted and tamper-proof.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-time Results',
    description: 'Live vote counting ensures transparency.',
    icon: BarChart3,
  },
  {
    title: 'Global Access',
    description: 'Vote securely from anywhere in the world.',
    icon: Globe,
  },
  {
    title: 'Verified Voters',
    description: 'Only eligible users can cast a vote.',
    icon: CheckCircle,
  },
];

const stats = [
  { number: '50M+', label: 'Votes Cast', icon: Eye },
  { number: '500+', label: 'Elections Managed', icon: TrendingUp },
  { number: '99.9%', label: 'System Uptime', icon: Zap },
  { number: '100%', label: 'Transparency', icon: BarChart3 },
];

const LandingPage = () => {
  const { user, userType, loading } = useAuth();
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start({ scale: 0.9, transition: { duration: 0.15 } });
        await controls.start({ scale: 1, transition: { duration: 0.15 } });
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait before next click
      }
    };
    sequence();
  }, [controls]);

  const getRedirectPath = () => {
    if (loading) return '#';
    if (user) {
      if (userType === 'voter') return '/voter-dashboard';
      if (userType === 'candidate') return '/candidate-dashboard';
      if (userType === 'admin') return '/admin-dashboard';
    }
    return '/auth-portal';
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (user) return 'Go to Your Dashboard';
    return 'Login / Register';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-6 bg-gradient-to-br from-[#0e1e70] to-[#6629bb]">
      <div className="absolute inset-0 backdrop-blur-md opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto text-white animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          The Future of <br />
          <span className="text-purple-300">Democratic Voting</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-blue-100">
          Secure, transparent, and accessible voting for the digital age. <br />
          Your voice matters, and we make sure it's heard.
        </p>

        {/* Animated Vote Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.div animate={controls}>
            <Link
              to="/auth-portal"
              className="bg-white text-blue-800 font-semibold text-lg px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <Lock className="w-5 h-5" />
              Start Voting Now
            </Link>
          </motion.div>

          <Link
            to="/public-results"
            className="border border-white text-white font-semibold text-lg px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white hover:text-blue-800 transition"
          >
            <BarChart3 className="w-5 h-5" />
            View Live Results
          </Link>
        </div>
      </div>
    </section>

      {/* Stats Section */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-blue-600 transition-transform duration-300 hover:rotate-360" />
              </div>
              <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose VoteSecure?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-2"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results CTA */}
      <div className="text-center mt-20 mb-16 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Live Election Results</h2>
        <p className="text-md text-gray-600 mb-6 max-w-md mx-auto">
          Real-time public results ensure fairness and accountability in every election.
        </p>
        <Link
          to="/public-results"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full text-lg font-semibold shadow-md hover:bg-purple-700 transition-all duration-300"
        >
          <BarChart3 className="h-6 w-6 mr-2" />
          View Results
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-500 border-t border-gray-200">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          Your data is protected with military-grade encryption.
        </div>
        <p className="mt-2">© 2025 VoteSecure. Empowering democracy through technology.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

