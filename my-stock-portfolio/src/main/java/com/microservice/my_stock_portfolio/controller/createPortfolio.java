package com.microservice.my_stock_portfolio.controller;

import com.microservice.my_stock_portfolio.Dto.ResponseDTO;
import com.microservice.my_stock_portfolio.Dto.StockHoldingsResponseDTO;
import com.microservice.my_stock_portfolio.Dto.TransactionHistoryDTO;
import com.microservice.my_stock_portfolio.service.HandleTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping ("/portfolio")
public class createPortfolio {

    private final HandleTransaction handleTransaction;

    @PostMapping ("/buy-stock")
    public ResponseDTO buyStock (@RequestParam int quantity, @RequestParam String stockSymbol, @RequestParam int investorId, @RequestParam double currentPrice) {
        return handleTransaction.handleBuyingStocks(quantity, stockSymbol, investorId, currentPrice);
    }

    @PostMapping ("/sell-stock")
    public ResponseDTO sellStock (@RequestParam int quantity, @RequestParam String stockSymbol, @RequestParam int investorId, @RequestParam double currentPrice) {
        return handleTransaction.handleSellingStocks(quantity, stockSymbol, investorId, currentPrice);
    }

    @GetMapping("/holdings/{investorId}")
    public ResponseEntity<List<StockHoldingsResponseDTO>> getHoldings(@PathVariable int investorId) {
        return ResponseEntity.ok(handleTransaction.getStockHoldings(investorId));
    }

    @GetMapping("/transactions/{investorId}")
    public ResponseEntity<List<TransactionHistoryDTO>> getTransactions(@PathVariable int investorId) {
        return ResponseEntity.ok(handleTransaction.getTransactionHistory(investorId));
    }
}
