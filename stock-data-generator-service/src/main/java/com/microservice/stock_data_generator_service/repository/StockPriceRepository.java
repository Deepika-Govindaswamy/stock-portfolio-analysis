package com.microservice.stock_data_generator_service.repository;

import com.microservice.stock_data_generator_service.Dto.StockPrices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockPriceRepository extends JpaRepository <StockPrices, String> {}
