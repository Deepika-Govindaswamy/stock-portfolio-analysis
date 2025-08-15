import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function StockBuySellDialog ({userId, isOpen, onClose, stock, 
                                             selectedTransactionType, setSelectedTransactionType, 
                                             refreshPortfolio, setRefreshPortfolio, loading, setLoading}) {

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !stock) return null;

  const total = quantity * stock.price;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
  };

  const handleBuy = async () => {
    try {
      setLoading(true);

      const url = `http://localhost:8080/portfolio/buy-stock?quantity=${quantity}&stockSymbol=${stock.symbol}&investorId=${userId}&currentPrice=${stock.price}`;
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to buy stock');
      }

      alert(`Successfully bought ${quantity} shares of ${stock.symbol} for $${total.toFixed(2)}`);
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshPortfolio(prev => !prev);
    }
  };


  const handleSell = async () => {
    try {
      setLoading(true);

      const url = `http://localhost:8080/portfolio/sell-stock?quantity=${quantity}&stockSymbol=${stock.symbol}&investorId=${userId}&currentPrice=${stock.price}`;
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to buy stock');
      }

      alert(`Successfully sold ${quantity} shares of ${stock.symbol} for $${total.toFixed(2)}`);
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshPortfolio(prev => !prev);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100  flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedTransactionType === "BUY" ? "Buy" : "Sell"} {stock.symbol}
          </h2>
        </div>

        {/* Quantity Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full bg-transparent border border-gray-400 rounded-lg px-4 py-3 text-gray-900 dark:text-white text-lg focus:outline-none focus:border-blue-600"
            min="1"
          />
        </div>

        {/* Total */}
        <div className="mb-8 text-gray-900 dark:text-white text-lg">
          Total: <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white py-3 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={selectedTransactionType === "BUY" ? handleBuy : handleSell}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : selectedTransactionType === "BUY" ? "Confirm Buy" : "Confirm Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}