import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from '../Navbar';

export default function RiskAnalysisHome ({isLoginOpen, setIsLoginOpen, isLoggedIn, setIsLoggedIn, email, setEmail, userId, setUserId}) {
  const [isOpen, setIsOpen] = useState(true);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCompanyName = (symbol) => {
    switch (symbol) {
      case 'AAPL' : return "Apple Inc.";
      case 'GOOGL' : return "Alphabet Inc.";
      case 'MSFT' : return "Microsoft Corp.";
      case 'AMZN' : return "Amazon Inc.";
      case 'TSLA' : return "Tesla Inc.";
      default : return "Apple Inc."
    }
  }

  useEffect(() => {

    console.log(userId)
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        // stockData = await fetch(`http://localhost:8080/portfolio/holdings/${localStorage.getItem("userId")}`);

        const response = await fetch(`http://127.0.0.1:8000/risk-summary/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch risk data");
        }
        const data = await response.json();
        setRiskData(data);
      } catch (error) {
        console.error("Error fetching risk data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-600 bg-red-300/20 border-red-800';
      case 'Medium': return 'text-yellow-600 bg-yellow-300/20 border-yellow-800';
      case 'Low': return 'text-green-600 bg-green-300/20 border-green-800';
      default: return 'text-gray-600 bg-gray-300/20 border-gray-800';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle size={16} className="text-red-400" />;
      case 'Medium': return <TrendingUp size={16} className="text-yellow-400" />;
      case 'Low': return <CheckCircle size={16} className="text-green-400" />;
      default: return <TrendingDown size={16} className="text-gray-400" />;
    }
  };

  const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
  const formatBeta = (value) => value.toFixed(4);

  const getOverallRisk = () => {
    if (!riskData) return 'Unknown';
    const highRiskCount = riskData.risk_summary.filter(stock => stock.risk_level === 'High').length;
    const totalStocks = riskData.risk_summary.length;
    
    if (highRiskCount >= totalStocks * 0.7) return 'High';
    if (highRiskCount >= totalStocks * 0.3) return 'Medium';
    return 'Low';
  };

  return (
      <div className="min-h-screen bg-gray-50 text-gray-900">

      <Navbar isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} 
                    isLoggedIn={localStorage.getItem("isLoggedIn") === "true"} setIsLoggedIn={setIsLoggedIn}
                    email={localStorage.getItem("email")} setEmail={setEmail}
                    setUserId={setUserId}
      />

      <div className="max-w-6xl mx-auto p-4">

        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6">
          
          {!loading && riskData && (
            <div className="flex items-center gap-4 text-sm">
              <h1 className="text-black text-2xl font-semibold">Portfolio Risk Analysis</h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskColor(getOverallRisk())}`}>
                {getRiskIcon(getOverallRisk())}
                <span>Overall Risk: {getOverallRisk()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-900">Analyzing portfolio risk...</p>
          </div>
        )}

        {/* Risk Summary Cards */}
        {!loading && riskData && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {riskData.risk_summary.map((stock, index) => (
              <div key={index} className="bg-zinc-100 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-black text-xl font-semibold">{getCompanyName(stock.stock)}</h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getRiskColor(stock.risk_level)}`}>
                      {getRiskIcon(stock.risk_level)}
                      <span>{stock.risk_level}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-200 rounded-lg p-4">
                    <p className="text-black text-sm mb-1">Volatility</p>
                    <p className="text-black text-lg font-semibold">{formatPercentage(stock.volatility)}</p>
                  </div>
                  
                  <div className="bg-slate-200 rounded-lg p-4">
                    <p className="text-black text-sm mb-1">Beta vs NASDAQ</p>
                    <p className="text-black text-lg font-semibold">{formatBeta(stock.beta_vs_nasdaq)}</p>
                  </div>
                  
                  <div className="bg-slate-200 rounded-lg p-4 col-span-2">
                    <p className="text-black text-sm mb-1">Beta vs S&P 500</p>
                    <p className="text-black text-lg font-semibold">{formatBeta(stock.beta_vs_sp500)}</p>
                  </div>
                </div>

                {/* Risk Interpretation */}
                <div className="mt-4 p-3 bg-slate-200 rounded-lg">
                  <p className="text-black text-lg">
                    {stock.volatility > 0.5 ? "High volatility indicates significant price swings." :
                     stock.volatility > 0.3 ? "Moderate volatility with regular price movements." :
                     "Low volatility suggests stable price movements."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Metrics Legend */}
        {!loading && riskData && (
          <div className="bg-slate-100 rounded-lg p-6 mt-6">
            <h3 className="text-black text-lg font-semibold mb-4">Risk Metrics Explained</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="text-black font-medium mb-2">Volatility</h4>
                <p className="text-gray-800">Measures how much the stock price fluctuates. Higher values indicate more risk.</p>
              </div>
              <div>
                <h4 className="text-black font-medium mb-2">Beta vs NASDAQ</h4>
                <p className="text-gray-800">Compares stock movement to NASDAQ. Values {">"} 1 are more volatile than the market.</p>
              </div>
              <div>
                <h4 className="text-black font-medium mb-2">Beta vs S&P 500</h4>
                <p className="text-gray-800">Compares stock movement to S&P 500. Values {">"} 1 are more volatile than the market.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}