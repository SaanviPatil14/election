// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Shield } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, userType, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Vote className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <Shield className="h-4 w-4 text-trust-green absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VoteSecure</h1>
              <p className="text-xs text-muted-foreground">Democratic Platform</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
              Login
            </Link>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;