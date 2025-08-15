package com.microservice.stock_data_generator_service.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class StockApiClient {

    @Value("${stock.api-url}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();

    public void fetchPrice(String symbol) {
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        System.out.println(response.getBody());
    }
}
