package com.microservice.my_stock_portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    private Integer investorId;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private String stockSymbol;

    private Long quantity;

    private Double stockPrice;

    private Double totalPrice;

    private Instant transactionCreatedAt;
}
