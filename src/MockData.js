export const initialStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 1950.25,
    previousPrice: 1720.8,
    percentageChange: 0.3,
    volume: 1000000,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2850.8,
    previousPrice: 2745.5,
    percentageChange: 0.19,
    volume: 500000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 2285.9,
    previousPrice: 2083.75,
    percentageChange: 0.76,
    volume: 750000,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon Inc.',
    price: 2600.45,
    previousPrice: 3290.2,
    percentageChange: 0.31,
    volume: 600000,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 2090.5,
    previousPrice: 1885.3,
    percentageChange: 0.59,
    volume: 900000,
  },
];

// Function to generate a mock price update for a given stock
export function generateMockPriceUpdate(stock) {
  
  const priceChange = (Math.random() - 0.5) * (stock.price * 0.02);
  
  const newPrice = stock.price + priceChange;
  
  const percentageChange = ((newPrice - stock.previousPrice) / stock.previousPrice) * 100;

  return {
    ...stock, 
    previousPrice: stock.price, 
    price: Number(newPrice.toFixed(2)), 
    percentageChange: Number(percentageChange.toFixed(2)),
    volume: stock.volume + Math.floor(Math.random() * 10000),
  };
}