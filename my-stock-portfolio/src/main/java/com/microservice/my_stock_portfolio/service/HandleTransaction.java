package com.microservice.my_stock_portfolio.service;

import com.microservice.my_stock_portfolio.Dto.ResponseDTO;
import com.microservice.my_stock_portfolio.Dto.StockHoldingsResponseDTO;
import com.microservice.my_stock_portfolio.Dto.TransactionHistoryDTO;
import com.microservice.my_stock_portfolio.entity.InvestorsPortfolio;
import com.microservice.my_stock_portfolio.entity.StockHoldings;
import com.microservice.my_stock_portfolio.entity.TransactionHistory;
import com.microservice.my_stock_portfolio.entity.TransactionType;
import com.microservice.my_stock_portfolio.exception.PortfolioNotFoundException;
import com.microservice.my_stock_portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HandleTransaction {

    private final StockPriceRepository repository;
    private final TransactionHistoryRepository transactionHistoryRepository;

    private final InvestorRepository investorRepository;
    private final InvestorPortfolioRepository investorPortfolioRepository;
    private final StockHoldingsRepository stockHoldingsRepository;



    public ResponseDTO handleBuyingStocks (int quantity, String stockSymbol, int investorId, double currentPrice) {

        if (quantity <= 0 ) {
            return new ResponseDTO ("Failed", "insufficient quantity", quantity, stockSymbol);
        }

        double totalPrice = quantity * currentPrice;

        String transactionType = "BUY";

        updatePortfolio (investorId, quantity, currentPrice, transactionType, stockSymbol, totalPrice);
        saveTransactionHistory (investorId, quantity, currentPrice, transactionType, stockSymbol, totalPrice);

        return new ResponseDTO ("Success", "successfully bought", quantity, stockSymbol);
    }

    public void saveTransactionHistory (int investorId, long quantity, double currentPrice, String transactionType, String stockSymbol, double totalPrice) {
        TransactionHistory history = TransactionHistory.builder()
                .investorId(investorId)
                .stockSymbol(stockSymbol)
                .quantity(quantity)
                .stockPrice(currentPrice)
                .transactionType(TransactionType.valueOf(transactionType.toUpperCase()))
                .transactionCreatedAt(Instant.now())
                .totalPrice(totalPrice)
                .build();

        transactionHistoryRepository.save(history);
    }

    public void updatePortfolio (int investorId, int quantity, double currentPrice, String transactionType, String stockSymbol, double totalPrice) {

        // update the stock quantity based on buying or selling
        InvestorsPortfolio portfolio = investorPortfolioRepository
                .findByInvestor_InvestorId(investorId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        StockHoldings holding = stockHoldingsRepository
                .findByPortfolio_PortfolioIdAndStockSymbol(portfolio.getPortfolioId(), stockSymbol)
                .orElse(null);


        if (transactionType.equals("BUY")) {
            if (holding == null) {
                // create new holding
                holding = StockHoldings.builder()
                        .stockSymbol(stockSymbol)
                        .quantity((long) quantity)
                        .stockPrice(currentPrice)
                        .transactionType(TransactionType.BUY)
                        .updatedAt(Instant.now())
                        .portfolio(portfolio)
                        .totalPrice(totalPrice)
                        .build();
            }

            else {
                // update existing quantity
                holding.setQuantity(holding.getQuantity() + quantity);
                holding.setStockPrice(currentPrice);
                holding.setUpdatedAt(Instant.now());
                holding.setTotalPrice(holding.getTotalPrice() + totalPrice);
            }

            stockHoldingsRepository.save(holding);
        }

        else if (transactionType.equals("SELL")) {
            if (holding == null) {
                throw new RuntimeException("Stock symbol not found in Portfolio");
            }

            else if (holding.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock available");
            }

            holding.setQuantity(holding.getQuantity() - quantity);
            holding.setStockPrice(currentPrice);
            holding.setUpdatedAt(Instant.now());
            holding.setTotalPrice(Math.abs(holding.getTotalPrice() - totalPrice));
        }

        stockHoldingsRepository.save(holding);
    }

    public ResponseDTO handleSellingStocks (int quantity, String stockSymbol, int investorId, double currentPrice ) {

        if (quantity <= 0 ) {
            return new ResponseDTO ("Failed", "insufficient quantity", quantity, stockSymbol);
        }

        String transactionType = "SELL";

        InvestorsPortfolio portfolio = investorPortfolioRepository
                .findByInvestor_InvestorId(investorId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        StockHoldings holding = stockHoldingsRepository
                .findByPortfolio_PortfolioIdAndStockSymbol(portfolio.getPortfolioId(), stockSymbol)
                .orElse(null);


        if (holding == null) {
            return new ResponseDTO("Failed", "Stock not found in portfolio", 0, stockSymbol);
        }

        if (holding.getQuantity() < quantity) {
            return new ResponseDTO("Failed", "Not enough stock to sell", quantity, stockSymbol);
        }

        // update quantity
        updatePortfolio(investorId, quantity, holding.getStockPrice(), transactionType, stockSymbol, currentPrice);

        saveTransactionHistory(investorId, quantity, holding.getStockPrice(), "SELL", stockSymbol, currentPrice);

        return new ResponseDTO("Success", "Successfully sold", quantity, stockSymbol);
    }

    public List<StockHoldingsResponseDTO> getStockHoldings(int investorId) {
        InvestorsPortfolio portfolio = investorPortfolioRepository
                .findByInvestor_InvestorId(investorId)
                .orElseThrow(() -> new PortfolioNotFoundException("Portfolio not found for investor ID " + investorId));

        List<StockHoldings> holdings = stockHoldingsRepository
                .findByPortfolio_PortfolioId(portfolio.getPortfolioId());

        return holdings.stream()
                .map(holding -> new StockHoldingsResponseDTO(
                        holding.getStockSymbol(),
                        holding.getStockPrice(),
                        holding.getQuantity().intValue(),
                        holding.getTotalPrice()
                ))
                .toList();
    }

    public List<TransactionHistoryDTO> getTransactionHistory(int investorId) {
        List<TransactionHistory> historyList = transactionHistoryRepository.findByInvestorId(investorId);

        return historyList.stream()
                .map(tx -> new TransactionHistoryDTO(
                        tx.getInvestorId(),
                        tx.getQuantity(),
                        tx.getStockPrice(),
                        tx.getTransactionCreatedAt(),
                        tx.getTotalPrice(),
                        tx.getTransactionType().name(),
                        tx.getStockSymbol()
                ))
                .toList();
    }


}
