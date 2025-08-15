import React, { useState, useEffect, useMemo, useRef} from 'react';
import Navbar from './components/Navbar';
import StockPriceTable from './components/StockPriceTable';
import PriceChart from './components/PriceChart';
import StockBuyDialog from './components/StockBuySellDialog';



const Home = ({ isLoginOpen, setIsLoginOpen, isLoggedIn, setIsLoggedIn, email, setEmail, stocks, chartData, userId, setUserId}) => {

  

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900`}>
      {/* Header */}
      <Navbar isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} 
              isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
              email={email} setEmail={setEmail}
              setUserId={setUserId}
      />

      <div className="flex">

        {isLoginOpen ? (
          <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} email={email} setEmail={setEmail}/>
        ) 
          : 
        (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Invested Trading Platform</h2>
            <StockPriceTable stocks={stocks} />
            <PriceChart stocks={stocks} chartData={chartData} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;