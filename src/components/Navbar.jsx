import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiQuillPenFill, RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { FaUserSecret, FaCompass, FaPenNib } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/posts') {
      return location.pathname === '/posts' || location.pathname.startsWith('/post/');
    }
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Feed', path: '/posts' },
    { name: 'Write Whisper', path: '/create' },
    { name: 'Dashboard', path: '/dashboard' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
              <FaUserSecret className="text-xl" />
            </div>
            <span className="font-outfit font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent group-hover:text-indigo-600 transition-colors duration-200">
              Inkognito
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-indigo-50/70 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/create"
              className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
            >
              <FaPenNib className="text-xs" />
              Write Anonymous
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <RiCloseLine className="text-24 text-2xl" /> : <RiMenu3Line className="text-24 text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-slate-100 bg-white/95 backdrop-blur-lg ${
          mobileMenuOpen ? 'max-h-72 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 mt-4"
          >
            Write Anonymous
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
