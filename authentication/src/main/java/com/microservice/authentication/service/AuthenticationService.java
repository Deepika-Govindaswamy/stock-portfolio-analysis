package com.microservice.authentication.service;

import com.microservice.authentication.dto.CreatePortfolioEntity;
import com.microservice.authentication.dto.InvestorLoginDetails;
import com.microservice.authentication.dto.InvestorRegisterDetails;
import com.microservice.authentication.dto.SaveInvestorsDetails;
import com.microservice.authentication.repository.SaveInvestorsDetailsRepository;
import com.microservice.authentication.repository.SaveInvestorsPortfolio;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.http.HttpResponse;
import java.time.Instant;

@Service
@Builder
public class AuthenticationService {

    private final SaveInvestorsDetailsRepository saveInvestorsDetailsRepository;
    private final SaveInvestorsPortfolio saveInvestorsPortfolio;

    public SaveInvestorsDetails registerInvestor (InvestorRegisterDetails investorRegisterDetails) {

        SaveInvestorsDetails details = SaveInvestorsDetails.builder()
                .investorEmail(investorRegisterDetails.investorEmail())
                .investorName(investorRegisterDetails.investorName())
                .password(investorRegisterDetails.password())
                .createdAt(Instant.now())
                .build();

        return saveInvestorsDetailsRepository.save(details);
    }

    public CreatePortfolioEntity createPortfolio (SaveInvestorsDetails investorRegisterDetails) {


        System.out.println(investorRegisterDetails.getInvestorEmail() + " " + investorRegisterDetails.getInvestorName());

        if (investorRegisterDetails.getInvestorId() != null) {
            CreatePortfolioEntity dto = CreatePortfolioEntity.builder()
                    .investorId(investorRegisterDetails.getInvestorId())
                    .createdAt(Instant.now())
                    .build();

            System.out.println("DTO: " + dto);

            saveInvestorsPortfolio.save(dto);

            return dto;
        }
        return null;
    }

    public ResponseEntity<SaveInvestorsDetails> loginInvestor (InvestorLoginDetails investorLoginDetails) {

        SaveInvestorsDetails loggedInvestor = saveInvestorsDetailsRepository.findByInvestorEmail(investorLoginDetails.investorEmail());

        System.out.println("loggedInvestor" + loggedInvestor);
        System.out.println("loggedInvestor pwd" + loggedInvestor.getPassword());
        System.out.println("incomming pwd" + investorLoginDetails.investorPassword());

        if (loggedInvestor != null) {

            if (loggedInvestor.getPassword().equals(investorLoginDetails.investorPassword())) {

                return ResponseEntity.status(200).body(loggedInvestor);
            }
        }

        return ResponseEntity.status(404).body(null);
    }
}
