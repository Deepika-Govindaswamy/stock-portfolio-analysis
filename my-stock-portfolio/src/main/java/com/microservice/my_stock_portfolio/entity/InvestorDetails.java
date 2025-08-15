package com.microservice.my_stock_portfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvestorDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer investorId;

    private String investorName;

    @Email
    @NotBlank
    private String investorEmail;

    private String password;

    private Instant createdAt;

    @OneToOne(mappedBy = "investor", cascade = CascadeType.ALL)
    private InvestorsPortfolio portfolio;
}
