package com.microservice.authentication.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table (name = "InvestorsPortfolio")
public class CreatePortfolioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer portfolioId;

    @Column(name = "investor_id", nullable = false, unique = true)
    private Integer investorId;

    private Instant createdAt;

}
