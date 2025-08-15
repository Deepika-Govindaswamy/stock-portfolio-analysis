import React, {useState} from 'react'
import StockBuySellDialog from './StockBuySellDialog';

export default function StockPurchaseComponent ({stocks, refreshPortfolio, setRefreshPortfolio, loading, setLoading}) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedStock, setSelectedStock] = useState(null);
  
  const [selectedTransactionType, setSelectedTransactionType] = useState(['BUY', 'SELL']);

  const openDialog = (stock, selectedTransactionType) => {
    setSelectedTransactionType(selectedTransactionType)
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedStock(null);
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Trading Dashboard</h2>
        </div>

        <div className="space-y-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">${stock.price.toFixed(2)}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  onClick={() => openDialog(stock,"BUY")}
                >
                  Buy
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  onClick={() => openDialog(stock,"SELL")}
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Buy Dialog */}
      <StockBuySellDialog userId={localStorage.getItem("investorId")} 
                          isOpen={isDialogOpen} onClose={closeDialog} stock={selectedStock} 
                          selectedTransactionType={selectedTransactionType} setSelectedTransactionType={setSelectedTransactionType} 
                          refreshPortfolio={refreshPortfolio} setRefreshPortfolio={setRefreshPortfolio}
                          loading={loading} setLoading={setLoading}
                          />
    </div>
  );
}