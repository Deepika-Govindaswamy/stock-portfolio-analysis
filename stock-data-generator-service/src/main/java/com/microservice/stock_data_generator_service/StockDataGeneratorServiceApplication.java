package com.microservice.stock_data_generator_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockDataGeneratorServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockDataGeneratorServiceApplication.class, args);
	}

}
