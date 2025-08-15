package com.microservice.my_stock_portfolio.repository;

import com.microservice.my_stock_portfolio.entity.StockHoldings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockHoldingsRepository extends JpaRepository<StockHoldings, String> {

    Optional<StockHoldings> findByPortfolio_PortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol);

    List<StockHoldings> findByPortfolio_PortfolioId(Integer portfolioId);
}
