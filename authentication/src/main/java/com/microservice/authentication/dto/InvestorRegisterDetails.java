package com.microservice.authentication.dto;

import java.time.Instant;

public record InvestorRegisterDetails (Integer investorId, String investorName, String investorEmail, String password, Instant createdAt) {}
