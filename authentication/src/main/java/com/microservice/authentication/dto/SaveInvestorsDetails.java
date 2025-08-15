package com.microservice.authentication.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table (name = "InvestorDetails")
public class SaveInvestorsDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer investorId;

    private String investorName;

    @Email
    @NotBlank
    private String investorEmail;

    private String password;

    private Instant createdAt;

}
