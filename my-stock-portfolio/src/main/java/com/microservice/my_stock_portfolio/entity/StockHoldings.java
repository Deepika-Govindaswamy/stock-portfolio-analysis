package com.microservice.my_stock_portfolio.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StockHoldings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int holdingId;

    private String stockSymbol;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private Long quantity;

    private Double stockPrice;

    private Instant updatedAt;

    private Double totalPrice;

    @ManyToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private InvestorsPortfolio portfolio;
}
