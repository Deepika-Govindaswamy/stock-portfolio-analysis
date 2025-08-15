import React, { useState, useEffect } from 'react';

export default function MyTradeHistory({ userId, refreshPortfolio, setLoading }) {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    if (!userId) return; // Safety check
    setLoading(true);

    fetch(`http://localhost:8080/portfolio/transactions/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 404 && errorData.message?.includes('Portfolio not found')) {
            setTransactionHistory([]);
            setLoading(false);
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch portfolio');
        }

        console.log ("data: ", res)
        return res.json();
      })
      .then((data) => {
        setTransactionHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, refreshPortfolio, setLoading]);

  if (!transactionHistory || transactionHistory.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <p className="text-lg font-semibold">No transaction history</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 text-gray-900 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Trade History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your recent trading activity</p>
        </div>

        {transactionHistory
          .slice()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((txns) => (
          <div key={txns.transactionId || `${txns.stockSymbol}-${txns.transactionCreatedAt}`} className="flex justify-between mb-4">
            <div className="flex items-center justify-between py-3 w-full">
              <div>
                <div className="font-semibold">{txns.transactionType === 'BUY' ? 'Bought' : 'Sold'} {txns.stockSymbol}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {txns.transactionType === 'BUY' ? 'Bought' : 'Sold'} {txns.quantity} shares @ ${(txns.totalPrice / txns.quantity).toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">${txns.totalPrice.toFixed(2)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{new Date(txns.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
