import React, { useState, useEffect } from 'react';

export default function MyPortfolio({ userId, refreshPortfolio, setLoading }) {

  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    if (!userId) return; // Safety check

    setLoading(true);

    fetch(`http://localhost:8080/portfolio/holdings/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 404 && errorData.message?.includes('Portfolio not found')) {
            setHoldings([]);
            setLoading(false);
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch portfolio');
        }
        return res.json();
      })
      .then((data) => {
        setHoldings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, refreshPortfolio, setLoading]);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <p className="text-lg font-semibold">Start trading to create portfolio</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 text-gray-900 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Your Portfolio</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your holdings</p>
        </div>

        {holdings
        .filter(stock => stock.quantity > 0)
        .map((stock) => {
          const currentPrice = stock.price;
          const currentValue = currentPrice * stock.quantity;
          const profitOrLoss = currentValue - stock.totalPrice;
          const profitOrLossPercentage = (profitOrLoss / stock.totalPrice) * 100;

          return (
            <div key={stock.stockSymbol} className="flex justify-between mb-4">
              <div>
                <strong>{stock.stockSymbol}</strong>
                <p>
                  {stock.quantity} shares @  ${stock.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p>${currentValue.toFixed(2)}</p>
                <p className={profitOrLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {profitOrLoss >= 0 ? '+' : ''}
                  ${profitOrLoss.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
