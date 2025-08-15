package com.microservice.my_stock_portfolio.Dto;

public record ResponseDTO (String status, String reason, int quantity, String stockSymbol) {}
