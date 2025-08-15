import React, { useState } from 'react';
import Home from '../Home';
import { Link, useNavigate } from "react-router";

export default function Login ({isLoginOpen, setIsLoginOpen, isLoggedIn, setIsLoggedIn, email, setEmail, setUserId}) {


  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginAuthentication = async (e) => {

    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8082/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorEmail: email,
          investorPassword: password,
         })
      });

      console.log (response)

      if (!response.ok) {
        console.log ("throwing error ")
        throw new Error("Authentication failed");
      }

      const data = await response.json(); 

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("investorId", data.investorId);

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsLogin(!isLogin);
      setUserId(data.investorId);  
      navigate("/");

    } 
    
    catch (error) {
        console.error("Auth error:", error);
        alert("Login failed");
    }
  };

  const handleRegisterAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:8082/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investorName: name, 
          investorEmail: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Registration failed: " + errorData.message || "Server error");
        return;
      }

      const data = await response.json();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("email", email);
      localStorage.setItem("investorId", data.investorId);

      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsLogin(!isLogin);
      setUserId(data.investorId);  
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration error: " + error.message);
    }
  };


  return (

    <div className="min-h-screen bg-white flex items-center justify-center p-4">

      <div className="bg-white rounded-lg border-gray-200 border p-6 w-full max-w-md relative mt-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-black text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h2>
          <Link 
            to={"/"}
            onClick={() => setIsLoginOpen(false)}
            className="text-black"
          >
            X
          </Link>
        </div>

        {/* Name Input */}
        {!isLogin && (
            <div className="mb-6">
                <label className="text-white text-sm mb-2 block">Name</label>
                <input
                type="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black-500"
                placeholder="Enter your name"
                />
            </div>
        )}



        {/* Email Input */}
        <div className="mb-6">
          <label className="text-white text-sm mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              localStorage.setItem("email", e.target.value);
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <label className="text-white text-sm mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black-500"
            placeholder="••••••••"
          />
        </div>

        {/* Login Button */}
        <button 
          onClick={isLogin ? handleLoginAuthentication : handleRegisterAuthentication}
          className="w-full bg-white text-black py-3 rounded-lg border-gray-200 border hover:bg-gray-100 transition-colors font-medium mb-6"
        >
          { isLogin ? "Login" : "Register" }
        </button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-500">{isLogin ? "Don't have an account?" : "Have an account?"} </span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-black"
          >
            { isLogin ? "Register" : "Login" }
          </button>
        </div>
      </div>
    </div>
  );
}