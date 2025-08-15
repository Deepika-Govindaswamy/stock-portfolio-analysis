package com.microservice.my_stock_portfolio.repository;

import com.microservice.my_stock_portfolio.entity.InvestorDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvestorRepository extends JpaRepository<InvestorDetails, Integer> {
    Optional<InvestorDetails> findByInvestorEmail(String email);
}
