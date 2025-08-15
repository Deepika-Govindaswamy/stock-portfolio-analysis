package com.microservice.stock_data_generator_service.Dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class StockPrices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String stockSymbol;

    private String companyName;

    private Double currentPrice;

    private Double changePercent;

    private Double openPrice;

    private Double closePrice;

    private Long volume;
}
