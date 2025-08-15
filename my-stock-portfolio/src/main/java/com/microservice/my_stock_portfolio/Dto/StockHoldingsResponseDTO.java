package com.microservice.my_stock_portfolio.Dto;

public record StockHoldingsResponseDTO (String stockSymbol, double price, int quantity, double totalPrice) {
}
