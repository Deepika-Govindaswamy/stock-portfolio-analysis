package com.microservice.stock_data_generator_service.service;

import com.microservice.stock_data_generator_service.Dto.StockPrices;
import com.microservice.stock_data_generator_service.repository.StockPriceRepository;
import com.microservice.stock_data_generator_service.utilities.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class StockDataGenerator {

    private final Random random = new Random();

    private final StockPriceRepository stockPriceRepository;

    public List<Stock> getInitialStocks() {
            List<Stock> stocks = new ArrayList<>();

            stocks.add(Stock.builder()
                    .stockSymbol("AAPL")
                    .companyName("Apple Inc.")
                    .currentPrice(1749.80)
                    .previousPrice(1580.25)
                    .changePercent(0.3)
                    .openPrice(1600.00)
                    .closePrice(1749.80)
                    .volume(1_000_000L)
                    .build());

            stocks.add(Stock.builder()
                    .stockSymbol("GOOGL")
                    .companyName("Alphabet Inc.")
                    .currentPrice(2745.5)
                    .previousPrice(2750.8)
                    .changePercent(0.19)
                    .openPrice(2760.00)
                    .closePrice(2745.5)
                    .volume(500_000L)
                    .build());

            stocks.add(Stock.builder()
                    .stockSymbol("MSFT")
                    .companyName("Microsoft Corporation")
                    .currentPrice(2783.75)
                    .previousPrice(2855.9)
                    .changePercent(0.76)
                    .openPrice(2840.00)
                    .closePrice(2783.75)
                    .volume(750_000L)
                    .build());

            stocks.add(Stock.builder()
                    .stockSymbol("AMZN")
                    .companyName("Amazon.com Inc.")
                    .currentPrice(3290.2)
                    .previousPrice(3300.45)
                    .changePercent(0.31)
                    .openPrice(3295.00)
                    .closePrice(3290.2)
                    .volume(600_000L)
                    .build());

            stocks.add(Stock.builder()
                    .stockSymbol("TSLA")
                    .companyName("Tesla Inc.")
                    .currentPrice(1885.3)
                    .previousPrice(1890.5)
                    .changePercent(0.59)
                    .openPrice(1880.00)
                    .closePrice(1885.3)
                    .volume(900_000L)
                    .build());

            return stocks;
        }

    public Stock generateMockPriceUpdate(Stock stock) {

        double priceChange = (random.nextDouble() - 0.5) * (stock.getPreviousPrice() * 0.02);
        double newPrice = stock.getPreviousPrice() + priceChange;
        newPrice = Math.round(newPrice * 100.0) / 100.0;

        double changePercent = ((newPrice - stock.getPreviousPrice()) / stock.getPreviousPrice()) * 100;

        double closingPrice = newPrice + ((random.nextDouble() - 0.5) * newPrice * 0.01);
        closingPrice = Math.round(closingPrice * 100.0) / 100.0;

        return Stock.builder()
                .stockSymbol(stock.getStockSymbol())
                .companyName(stock.getCompanyName())
                .previousPrice(stock.getPreviousPrice())
                .currentPrice(newPrice)
                .changePercent(changePercent)
                .volume(stock.getVolume() + random.nextInt(10_000))
                .openPrice(stock.getOpenPrice())
                .closePrice(closingPrice)
                .build();
    }

    public void saveStockData (Stock stock) {

        System.out.println(stock);

        StockPrices stockPrices = StockPrices.builder()
                .stockSymbol(stock.getStockSymbol())
                .companyName(stock.getCompanyName())
                .currentPrice(stock.getCurrentPrice())
                .changePercent(stock.getChangePercent())
                .volume(stock.getVolume())
                .build();

        stockPriceRepository.save(stockPrices);
    }
}
