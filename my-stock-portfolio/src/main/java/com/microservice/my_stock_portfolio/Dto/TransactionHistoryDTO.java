package com.microservice.my_stock_portfolio.Dto;

import java.time.Instant;

public record TransactionHistoryDTO (Integer investorId, Long quantity, Double currentPrice, Instant timestamp, double totalPrice, String transactionType, String stockSymbol) {
}
