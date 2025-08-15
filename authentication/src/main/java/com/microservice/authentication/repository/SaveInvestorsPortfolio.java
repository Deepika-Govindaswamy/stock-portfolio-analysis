package com.microservice.authentication.repository;

import com.microservice.authentication.dto.CreatePortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaveInvestorsPortfolio extends JpaRepository <CreatePortfolioEntity, Integer> {}
