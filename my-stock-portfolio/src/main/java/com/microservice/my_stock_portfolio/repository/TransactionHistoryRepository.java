package com.microservice.my_stock_portfolio.repository;

import com.microservice.my_stock_portfolio.Dto.TransactionHistoryDTO;
import com.microservice.my_stock_portfolio.entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Integer> {
    List<TransactionHistory> findByInvestorId(Integer investorId);
}
