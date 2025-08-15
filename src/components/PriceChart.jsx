import React, {useState, useEffect} from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Tooltip } from 'recharts';
import { generateMockPriceUpdate } from '../MockData';

export default function PriceChart ({stocks: initialStocks, chartData}) {

    const [chartType, setChartType] = useState('line');
    const [showPercentages, setShowPercentages] = useState(false);
    const [selectedStocks, setSelectedStocks] = useState(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']);

    const [stocks, setStocks] = useState(initialStocks || []);

    const colors = ['#3366cc', '#3ba78c', '#e68a3f', '#c462d9', '#e14c72'];

    const toggleStock = (symbol) => {
        setSelectedStocks(prev => 
        prev.includes(symbol) 
            ? prev.filter(s => s !== symbol)
            : [...prev, symbol]
        );
    };

    useEffect(() => {
      const coloredStocks = (initialStocks || []).map((stock, idx) => ({
        ...stock,
        color: stock.color || colors[idx % colors.length],
      }));
      setStocks(coloredStocks);
    }, []);


    useEffect(() => {
      const interval = setInterval(() => {
        setStocks(prev =>
          prev.map(generateMockPriceUpdate)
        );
      }, 3000);

      return () => clearInterval(interval);
    }, []);


    const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={chartData}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs" />
          <YAxis domain={['dataMin * 0.9', 'dataMax * 1.1']} axisLine={false} tickLine={false} className="text-xs" />
          <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e5',
          }}
          labelStyle={{ color: '#050c1a' }}
          formatter={(value) => [value.toFixed(2)]}
        />

          {stocks.map(stock => 
            selectedStocks.includes(stock.symbol) && (
              <Area
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={stock.color}
                fill={stock.color}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            )
          )}
        </AreaChart>
      );
    } else if (chartType === 'bar') {
      return (
        <BarChart data={chartData}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs" />
          <YAxis domain={['dataMin * 0.9', 'dataMax * 1.1']} axisLine={false} tickLine={false} className="text-xs" />
          <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e5',
          }}
          labelStyle={{ color: '#050c1a' }}
          formatter={(value) => [value.toFixed(2)]}
        />
          {stocks.map(stock => 
            selectedStocks.includes(stock.symbol) && (
              <Bar key={stock.symbol} dataKey={stock.symbol} fill={stock.color} />
            )
          )}
        </BarChart>
      );
    } else {
      return (
        <LineChart data={chartData}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs" />
          <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} className="text-xs" />
          <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e5e5e5',
          }}
          labelStyle={{ color: '#050c1a' }}
          formatter={(value) => [value.toFixed(2)]}
        />
          {stocks.map(stock => 
            selectedStocks.includes(stock.symbol) && (
              <Line
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={stock.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )
          )}
        </LineChart>
      );
    }
  };

  return (
    <div>
        <div className={`bg-white border-gray-200 rounded-lg border`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Price Chart</h3>
                <div className="flex items-center gap-4">
                  {/* Chart Type Buttons */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                    <button 
                      onClick={() => setChartType('area')}
                      className={`px-3 py-1 text-sm rounded ${chartType === 'area' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                    >
                      Area
                    </button>
                    <button 
                      onClick={() => setChartType('line')}
                      className={`px-3 py-1 text-sm rounded ${chartType === 'line' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                    >
                      Line
                    </button>
                    <button 
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock Selection Tags */}
              <div className="flex items-center gap-2 mb-4">
                {stocks.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => toggleStock(stock.symbol)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedStocks.includes(stock.symbol)
                        ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
    </div>
  )
}
