import react, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react'
import Home from './Home'
import './App.css'
import { Routes, Route } from "react-router-dom";
import AIPortfolioAnalysis from './components/AIPortfolioAnalysis';
import Navbar from './components/Navbar';

const TradingDashboard = lazy(() => import('./components/TradingDashboard'));
const Login = lazy(() => import('./components/Login'));
const RiskAnalysisHome = lazy(() => import('./components/risk_analysis/RiskAnalysisHome'));

import { initialStocks } from './MockData';
import { generateMockPriceUpdate } from './MockData';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [stocks, setStocks] = useState(initialStocks);
  
  const chartDataRef = useRef([]);
  const [chartData, setChartData] = useState([]);

  const colorPalette = ['#3366cc', '#3ba78c', '#e68a3f', '#c462d9', '#e14c72'];

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("investorId");

    if (storedLoginStatus) {
      setIsLoggedIn(true);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const coloredInitialStocks = useMemo(() => {
    return initialStocks.map((stock, index) => ({
      ...stock,
      color: colorPalette[index % colorPalette.length],
    }));
  }, []);

  
    useEffect(() => {
      const interval = setInterval(() => {
        setStocks(prevStocks => {
          const updatedStocks = prevStocks.map(generateMockPriceUpdate);
  
          const timestamp = new Date().toLocaleTimeString();
          const newEntry = { time: timestamp };
          for (const stock of updatedStocks) {
            newEntry[stock.symbol] = stock.price;
          }
  
          chartDataRef.current = [...chartDataRef.current.slice(-19), newEntry];
          setChartData(chartDataRef.current);
  
          return updatedStocks;
        });
      }, 2000);
  
      return () => clearInterval(interval);
    }, []);
  
  
  return (

    <div>

        <Navbar isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} 
                      isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
                      email={email} setEmail={setEmail}
                      setUserId={setUserId} />

        <Routes>
          <Route path="/" element=
            {<Home isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen}
              isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
              email={email} setEmail={setEmail}
              stocks={stocks} chartData={chartData}
              userId = {userId} setUserId = {setUserId}
            />}
          />

          <Route path="/my-portfolio-dashboard" element={<TradingDashboard isLoggedIn={isLoggedIn} email={email} stocks={stocks} userId={userId}/>} />

          <Route path="/login" element=
            {<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
              email={email} setEmail={setEmail}
              setUserId = {setUserId}
              setIsLoginOpen ={setIsLoginOpen}
            />} />

          <Route path='/risk-analysis' element={<RiskAnalysisHome userId = {userId} />}></Route>

          <Route path='/generate-ai-insights' element = {<AIPortfolioAnalysis userId = {userId}/>}></Route>

      </Routes>
    </div>


  )
}

export default App
