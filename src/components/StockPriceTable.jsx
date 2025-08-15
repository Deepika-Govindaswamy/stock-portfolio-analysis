import React from 'react'

export default function StockPriceTable ({stocks}) {

    

    const formatChange = (change) => {
        const sign = change > 0 ? '+' : change < 0 ? '' : '';
        return `${sign}${change.toFixed(2)}%`;
      };
    
      const getChangeColor = (change) => {
        if (change > 0) return 'text-green-500';
        if (change < 0) return 'text-red-500';
        return 'text-gray-500';
      };

  return (
    <div>
        <div className={"bg-white border-gray-200'rounded-lg border overflow-hidden mb-6"}>
            <div className={`bg-gray-50 px-6 py-3 border-b border-gray-200`}>
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500">
                <div>Symbol</div>
                <div>Name</div>
                <div>Price</div>
                <div>Change</div>
                <div>Volume</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-gray-600 dark:text-gray-400">{stock.name}</div>
                    <div className="font-mono">${stock.price.toFixed(2)}</div>
                    <div className={`${getChangeColor(stock.percentageChange)} font-medium`}>
                      {formatChange(stock.percentageChange)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">{stock.volume.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}
