import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, PieChart, AlertTriangle, CheckCircle, Star, DollarSign, BarChart3, Target } from 'lucide-react';

export default function AIPortfolioAnalysis() {

  const [isOpen, setIsOpen] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');


  const mockAnalysisData = {
    "user_id": 19,
    "portfolio_id": 8,
    "analysis_timestamp": "2025-08-15T18:55:25.673851",
    "portfolio_summary": {
      "total_value": 4482.420104980469,
      "holdings": {
        "MSFT": 2.0,
        "AAPL": 10.0,
        "TSLA": 2.0,
        "AMZN": 2.0
      },
      "supported_stocks_count": 4
    },
    "ai_insights": {
      "summary": "Your $4,482 portfolio is showing mixed results with 0 stocks showing gains and 0 showing losses. Diversification score is 0.8/1.0. Consider reviewing positions with high volatility and maintaining balanced exposure across different stock clusters.",
      "key_findings": {
        "unusual_gains_count": 0,
        "unusual_losses_count": 0,
        "volatility_spikes_count": 0,
        "diversification_score": 0.81
      }
    },
    "trend_analysis": {
      "unusual_gains": [],
      "unusual_losses": [],
      "volatility_spikes": [],
      "analysis_summary": {
        "MSFT": {
          "current_price": 525.5800170898438,
          "daily_change": 0.005933311776486651,
          "recent_avg_return": 0.0014038908585604303,
          "volatility": 0.011309855046992334,
          "position_value": 1051.1600341796875,
          "shares": 2.0
        },
        "AAPL": {
          "current_price": 230.74000549316406,
          "daily_change": -0.008763610691771541,
          "recent_avg_return": 0.0014877288925774445,
          "volatility": 0.011355561081695002,
          "position_value": 2307.4000549316406,
          "shares": 10.0
        },
        "TSLA": {
          "current_price": 331.3800048828125,
          "daily_change": -0.012515590492607276,
          "recent_avg_return": 0.0011594295188722015,
          "volatility": 0.01682108682736335,
          "position_value": 662.760009765625,
          "shares": 2.0
        },
        "AMZN": {
          "current_price": 230.5500030517578,
          "daily_change": -0.0018616013669359647,
          "recent_avg_return": 0.0070412330549845855,
          "volatility": 0.014205017695812183,
          "position_value": 461.1000061035156,
          "shares": 2.0
        }
      }
    },
    "diversification_analysis": {
      "score": 0.81,
      "score_interpretation": "Excellent",
      "clusters": {
        "1": ["AAPL"],
        "0": ["TSLA", "AMZN"],
        "2": ["MSFT"]
      },
      "suggestions": [
        {
          "type": "reduce_concentration",
          "symbols": ["TSLA", "AMZN"],
          "reason": "Over-concentrated in cluster 0",
          "action": "Consider reducing position sizes in this cluster"
        }
      ],
      "position_breakdown": {
        "MSFT": 1051.1600341796875,
        "AAPL": 2307.4000549316406,
        "TSLA": 662.760009765625,
        "AMZN": 461.1000061035156
      }
    },
    "recommendations": {
      "immediate_actions": [],
      "long_term_suggestions": [
        {
          "type": "reduce_concentration",
          "symbols": ["TSLA", "AMZN"],
          "reason": "Over-concentrated in cluster 0",
          "action": "Consider reducing position sizes in this cluster"
        }
      ]
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getDiversificationColor = (score) => {
    if (score >= 0.8) return 'text-green-400 bg-green-900/20 border-green-800';
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
    return 'text-red-400 bg-red-900/20 border-red-800';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const calculatePortfolioWeight = (positionValue, totalValue) => {
    return (positionValue / totalValue) * 100;
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-100 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-black text-2xl font-semibold">Portfolio Analysis Dashboard</h1>
          </div>

          {!loading && analysisData && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-800">Last Updated: {formatDate(analysisData.analysis_timestamp)}</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing portfolio data...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && analysisData && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-green-400" size={24} />
                  <h3 className="text-white text-lg font-semibold">Total Value</h3>
                </div>
                <p className="text-green-400 text-3xl font-bold">{formatCurrency(analysisData.portfolio_summary.total_value)}</p>
                <p className="text-gray-400 text-sm mt-1">{analysisData.portfolio_summary.supported_stocks_count} stocks</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="text-blue-400" size={24} />
                  <h3 className="text-white text-lg font-semibold">Diversification</h3>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getDiversificationColor(analysisData.diversification_analysis.score)}`}>
                  <Star size={16} />
                  <span>{analysisData.diversification_analysis.score_interpretation}</span>
                </div>
                <p className="text-white text-xl font-bold mt-2">{(analysisData.diversification_analysis.score * 100).toFixed(0)}/100</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="text-purple-400" size={24} />
                  <h3 className="text-white text-lg font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Unusual Gains</span>
                    <span className="text-white">{analysisData.ai_insights.key_findings.unusual_gains_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Volatility Spikes</span>
                    <span className="text-white">{analysisData.ai_insights.key_findings.volatility_spikes_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="text-blue-400" size={20} />
                AI Portfolio Summary
              </h3>
              <p className="text-gray-300 leading-relaxed">{analysisData.ai_insights.summary}</p>
            </div>

            {/* Holdings Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(analysisData.trend_analysis.analysis_summary).map(([symbol, data]) => (
                <div key={symbol} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white text-xl font-semibold">{symbol}</h3>
                      <p className="text-gray-400 text-sm">{data.shares} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-lg font-semibold">{formatCurrency(data.current_price)}</p>
                      <div className={`flex items-center gap-1 ${getChangeColor(data.daily_change)}`}>
                        {getChangeIcon(data.daily_change)}
                        <span className="text-sm">{formatPercentage(data.daily_change)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Position Value</p>
                      <p className="text-white font-semibold">{formatCurrency(data.position_value)}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Portfolio Weight</p>
                      <p className="text-white font-semibold">{calculatePortfolioWeight(data.position_value, analysisData.portfolio_summary.total_value).toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Avg Return</p>
                      <p className={`font-semibold ${getChangeColor(data.recent_avg_return)}`}>{formatPercentage(data.recent_avg_return)}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Volatility</p>
                      <p className="text-white font-semibold">{formatPercentage(data.volatility)}</p>
                    </div>
                  </div>

                  {/* Portfolio Weight Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${calculatePortfolioWeight(data.position_value, analysisData.portfolio_summary.total_value)}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {(analysisData.recommendations.immediate_actions.length > 0 || analysisData.recommendations.long_term_suggestions.length > 0) && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  Recommendations
                </h3>

                {analysisData.recommendations.immediate_actions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-red-400 font-medium mb-2">Immediate Actions</h4>
                    {analysisData.recommendations.immediate_actions.map((action, index) => (
                      <div key={index} className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-2">
                        <p className="text-white font-medium">{action.symbols?.join(', ')}</p>
                        <p className="text-gray-300 text-sm">{action.reason}</p>
                        <p className="text-red-300 text-sm mt-1">{action.action}</p>
                      </div>
                    ))}
                  </div>
                )}

                {analysisData.recommendations.long_term_suggestions.length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Long-term Suggestions</h4>
                    {analysisData.recommendations.long_term_suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3 mb-2">
                        <p className="text-white font-medium">{suggestion.symbols?.join(', ')}</p>
                        <p className="text-gray-300 text-sm">{suggestion.reason}</p>
                        <p className="text-yellow-300 text-sm mt-1">{suggestion.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Diversification Clusters */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Diversification Clusters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysisData.diversification_analysis.clusters).map(([clusterId, stocks]) => (
                  <div key={clusterId} className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Cluster {clusterId}</h4>
                    <div className="space-y-1">
                      {stocks.map(stock => (
                        <span key={stock} className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm mr-1 mb-1">
                          {stock}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}