
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, PieChart, AlertTriangle, CheckCircle, Star, DollarSign, BarChart3, Target } from 'lucide-react';

export default function AIPortfolioAnalysis ({userId}) {

  const [isOpen, setIsOpen] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notReceivedData, setNotReceivedData] = useState(true);

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
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8001/generate-ai-insights/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch AI insights");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        
        // Check if the response has valid portfolio data
        if (data && 
            data.portfolio_summary && 
            data.trend_analysis && 
            data.trend_analysis.analysis_summary && 
            Object.keys(data.trend_analysis.analysis_summary).length > 0) {
          setAnalysisData(data);
          setNotReceivedData(false);
        } else {
          setNotReceivedData(true);
          setAnalysisData(null);
        }
        
      } catch (error) {
        setNotReceivedData(true);
        setAnalysisData(null);
        console.error("Error fetching AI insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [userId]);

  useEffect(() => {
    if (analysisData) {
      console.log("Updated state analysisData:", analysisData);
    }
  }, [analysisData]);

  const formatCurrency = (value) => `$${value?.toFixed(2) || '0.00'}`;
  const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const getDiversificationColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-300/20 border-green-800';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-300/20 border-yellow-800';
    return 'text-red-600 bg-red-300/20 border-red-800';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const calculatePortfolioWeight = (positionValue, totalValue) => {
    return totalValue ? (positionValue / totalValue) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-100 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-black text-2xl font-semibold">AI Analysis Dashboard</h1>
          </div>

          {!loading && analysisData && analysisData.analysis_timestamp && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-gray-800">Last Updated: {formatDate(analysisData.analysis_timestamp)}</span>
            </div>
          )}
        </div>

        {/* No Data State */}
        {!loading && notReceivedData && (
          <div className="bg-slate-100 rounded-lg p-12 text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-black text-xl font-semibold mb-2">No Portfolio Data</h2>
            <p className="text-gray-600 mb-4">Start trading to generate AI insights and analysis for your portfolio.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-100 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-black">Analyzing portfolio data...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && analysisData && analysisData.portfolio_summary && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-emerald-700" size={24} />
                  <h3 className="text-black text-lg font-semibold">Total Value</h3>
                </div>
                <p className="text-emerald-700 text-3xl font-bold">{formatCurrency(analysisData.portfolio_summary.total_value)}</p>
                <p className="text-black text-sm mt-1">{analysisData.portfolio_summary.supported_stocks_count || 0} stocks</p>
              </div>

              <div className="bg-slate-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="text-blue-400" size={24} />
                  <h3 className="text-black text-lg font-semibold">Diversification</h3>
                </div>
                {analysisData.diversification_analysis && (
                  <>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getDiversificationColor(analysisData.diversification_analysis.score)}`}>
                      <Star size={16} />
                      <span>{analysisData.diversification_analysis.score_interpretation}</span>
                    </div>
                    <p className="text-black text-xl font-bold mt-2">{(analysisData.diversification_analysis.score * 100).toFixed(0)}/100</p>
                  </>
                )}
              </div>

              <div className="bg-slate-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="text-purple-400" size={24} />
                  <h3 className="text-black text-lg font-semibold">AI Insights</h3>
                </div>
                {analysisData.ai_insights && analysisData.ai_insights.key_findings && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-black text-sm">Unusual Gains</span>
                      <span className="text-black">{analysisData.ai_insights.key_findings.unusual_gains_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black text-sm">Volatility Spikes</span>
                      <span className="text-black">{analysisData.ai_insights.key_findings.volatility_spikes_count || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Summary */}
            {analysisData.ai_insights && analysisData.ai_insights.summary && (
              <div className="bg-slate-100 rounded-lg p-6">
                <h3 className="text-black text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="text-blue-400" size={20} />
                  AI Portfolio Summary
                </h3>
                <p className="text-black leading-relaxed">{analysisData.ai_insights.summary}</p>
              </div>
            )}

            {/* Holdings Analysis */}
            {analysisData.trend_analysis && 
             analysisData.trend_analysis.analysis_summary && 
             Object.keys(analysisData.trend_analysis.analysis_summary).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysisData.trend_analysis.analysis_summary).map(([symbol, data]) => (
                  <div key={symbol} className="bg-slate-100 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-black text-xl font-semibold">{getCompanyName(symbol)}</h3>
                        <p className="text-black text-sm">{data.shares || 0} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="text-black text-lg font-semibold">{formatCurrency(data.current_price)}</p>
                        <div className={`flex items-center gap-1 ${getChangeColor(data.daily_change || 0)}`}>
                          {getChangeIcon(data.daily_change || 0)}
                          <span className="text-sm">{formatPercentage(data.daily_change || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-black text-xs mb-1">Position Value</p>
                        <p className="text-black font-semibold">{formatCurrency(data.position_value)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-black text-xs mb-1">Portfolio Weight</p>
                        <p className="text-black font-semibold">{calculatePortfolioWeight(data.position_value, analysisData.portfolio_summary.total_value).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-black text-xs mb-1">Avg Return</p>
                        <p className={`font-semibold ${getChangeColor(data.recent_avg_return || 0)}`}>{formatPercentage(data.recent_avg_return || 0)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-black text-xs mb-1">Volatility</p>
                        <p className="text-black font-semibold">{formatPercentage(data.volatility || 0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {analysisData.recommendations && 
             (analysisData.recommendations.immediate_actions?.length > 0 || analysisData.recommendations.long_term_suggestions?.length > 0) && (
              <div className="bg-slate-100 rounded-lg p-6">
                <h3 className="text-black text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400" size={20} />
                  Recommendations
                </h3>

                {analysisData.recommendations.immediate_actions?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-red-400 font-medium mb-2">Immediate Actions</h4>
                    {analysisData.recommendations.immediate_actions.map((action, index) => (
                      <div key={index} className="bg-transparent border border-red-800 rounded-lg p-3 mb-2">
                        <p className="text-black font-medium">{action.symbols?.join(', ') || 'N/A'}</p>
                        <p className="text-red-700 text-sm">{action.reason || ''}</p>
                        <p className="text-red-300 text-sm mt-1">{action.action || ''}</p>
                      </div>
                    ))}
                  </div>
                )}

                {analysisData.recommendations.long_term_suggestions?.length > 0 && (
                  <div>
                    <h4 className="text-black font-medium mb-2">Long-term Suggestions</h4>
                    {analysisData.recommendations.long_term_suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-transparent border-2 border-red-800 rounded-lg p-3 mb-2">
                        <p className="text-black font-medium">{suggestion.symbols?.join(', ') || 'N/A'}</p>
                        <p className="text-gray-700 text-sm">{suggestion.reason || ''}</p>
                        <p className="text-gray-700 text-sm mt-1">{suggestion.action || ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Diversification Clusters */}
            {analysisData.diversification_analysis && 
             analysisData.diversification_analysis.clusters && 
             Object.keys(analysisData.diversification_analysis.clusters).length > 0 && (
              <div className="bg-slate-100 rounded-lg p-6">
                <h3 className="text-black text-lg font-semibold mb-4">Diversification Clusters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(analysisData.diversification_analysis.clusters).map(([clusterId, stocks]) => (
                    <div key={clusterId} className="bg-white rounded-lg p-4">
                      <h4 className="text-black font-medium mb-2">Cluster {clusterId}</h4>
                      <div className="space-y-1">
                        {Array.isArray(stocks) ? stocks.map(stock => (
                          <span key={stock} className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm mr-1 mb-1">
                            {stock}
                          </span>
                        )) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}