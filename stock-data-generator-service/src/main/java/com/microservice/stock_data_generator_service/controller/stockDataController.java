package com.microservice.stock_data_generator_service.controller;

import com.microservice.stock_data_generator_service.service.StockDataGenerator;
import com.microservice.stock_data_generator_service.utilities.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/portfolio")
public class stockDataController {

    private final StockDataGenerator stockDataGenerator;

    @GetMapping ("/get-stock-prices")
    @Scheduled(fixedRate = 1000)
    public void generateStockData() {

        List<Stock> initialStocks = stockDataGenerator.getInitialStocks();

        for (Stock stock : initialStocks) {
            Stock stockData = stockDataGenerator.generateMockPriceUpdate(stock);
            stockDataGenerator.saveStockData (stockData);
        }
    }
}

