package com.microservice.my_stock_portfolio.repository;

import com.microservice.my_stock_portfolio.entity.StockPrices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockPriceRepository extends JpaRepository <StockPrices, Integer> {
}
