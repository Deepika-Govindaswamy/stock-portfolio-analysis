import React,  { useState } from 'react';
import Navbar from './Navbar';
import StockPurchaseComponent from './StockPurchaseComponent';
import MyPortfolio from './MyPortfolio';
import MyTradeHistory from './MyTradeHistory';


export default function TradingDashboard ({isLoggedIn, email, stocks, userId}) {

   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [refreshPortfolio, setRefreshPortfolio] = useState(false);
   const [loading, setLoading] = useState (false)
   
  return (

    <div>
      <Navbar isLoggedIn={isLoggedIn} email={email}/>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Trading Dashboard */}
          <StockPurchaseComponent stocks={stocks} userId={localStorage.getItem("investorId")} refreshPortfolio={refreshPortfolio} 
            setRefreshPortfolio={setRefreshPortfolio} loading={loading} setLoading={setLoading} 
          />

          {/* Your Portfolio */}
          <MyPortfolio userId={localStorage.getItem("investorId")} stocks={stocks} refreshPortfolio={refreshPortfolio} setLoading={setLoading}/>

          {/* Trade History */}
          <MyTradeHistory userId={localStorage.getItem("investorId")} stocks={stocks} refreshPortfolio={refreshPortfolio} setLoading={setLoading}/>

        </div>
      </div>
    </div>
  );
}