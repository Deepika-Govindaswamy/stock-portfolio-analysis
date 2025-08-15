
import React, { useState } from 'react';
import { Link } from "react-router";

export default function Navbar({ isLoggedIn, setIsLoggedIn, email, setEmail, setUserId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-gray-200 border-b px-6 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

        {/* Left - Logo */}
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-xl font-semibold">Invested</h1>
          </Link>
        </div>

        {/* Center - Desktop Nav */}
        <div className="hidden md:flex justify-center">
          <div className="flex items-center gap-7">
            {isLoggedIn && <Link to="/my-portfolio-dashboard">My Portfolio</Link>}
            {isLoggedIn && <Link to="/risk-analysis">Risk Analysis</Link>}
            {isLoggedIn && <Link to="/generate-ai-insights">AI Insights</Link>}
          </div>
        </div>

        {/* Right - Auth / Hamburger */}
        <div className="flex justify-end items-center gap-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-5">
            {isLoggedIn ? (
              <>
                <h3>{email}</h3>
                <Link
                  to="/"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setEmail("");
                    setUserId(null);
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("email");
                    localStorage.removeItem("userId");
                  }}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 items-center">
          {isLoggedIn && <Link to="/my-portfolio-dashboard" onClick={() => setIsMenuOpen(false)}>My Portfolio</Link>}
          {isLoggedIn && <Link to="/risk-analysis" onClick={() => setIsMenuOpen(false)}>Risk Analysis</Link>}
          {isLoggedIn && <Link to="/generate-ai-insights" onClick={() => setIsMenuOpen(false)}>AI Insights</Link>}
          {isLoggedIn ? (
            <Link
              to="/"
              onClick={() => {
                setIsLoggedIn(false);
                setEmail("");
                setUserId(null);
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("email");
                localStorage.removeItem("investorId");
                setIsMenuOpen(false);
              }}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
