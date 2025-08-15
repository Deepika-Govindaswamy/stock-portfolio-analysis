package com.microservice.authentication.controller;

import com.microservice.authentication.dto.CreatePortfolioEntity;
import com.microservice.authentication.dto.InvestorLoginDetails;
import com.microservice.authentication.dto.SaveInvestorsDetails;
import com.microservice.authentication.service.AuthenticationService;
import com.microservice.authentication.dto.InvestorRegisterDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public CreatePortfolioEntity registerInvestor(@RequestBody InvestorRegisterDetails investorRegisterDetails) {

        SaveInvestorsDetails savedDetails = authenticationService.registerInvestor(investorRegisterDetails);

        CreatePortfolioEntity saved = authenticationService.createPortfolio(savedDetails);

        return saved;
    }

    @PostMapping ("/login")
    public ResponseEntity<?> loginInvestor(@RequestBody InvestorLoginDetails investorLoginDetails) {

        ResponseEntity res = authenticationService.loginInvestor(investorLoginDetails);
        System.out.println(res.getStatusCode());
        return res;

    }
}