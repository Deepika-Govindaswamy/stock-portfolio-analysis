package com.microservice.authentication.repository;

import com.microservice.authentication.dto.SaveInvestorsDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaveInvestorsDetailsRepository extends JpaRepository<SaveInvestorsDetails, Integer> {

    SaveInvestorsDetails findByInvestorEmail (String email);
}
