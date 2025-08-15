package com.microservice.stock_data_generator_service.utilities;

import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Stock {

    private String stockSymbol;
    private String companyName;
    private Double previousPrice;
    private Double currentPrice;
    private Double changePercent;
    private Double openPrice;
    private Double closePrice;
    private Long volume;
}
