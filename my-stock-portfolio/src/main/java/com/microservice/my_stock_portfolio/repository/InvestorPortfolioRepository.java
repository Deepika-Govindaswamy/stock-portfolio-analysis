package com.microservice.my_stock_portfolio.repository;

import com.microservice.my_stock_portfolio.entity.InvestorsPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvestorPortfolioRepository extends JpaRepository<InvestorsPortfolio, Integer> {
    Optional<InvestorsPortfolio> findByInvestor_InvestorId(Integer investorId);
}
