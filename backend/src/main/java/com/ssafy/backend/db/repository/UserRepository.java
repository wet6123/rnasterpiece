package com.ssafy.backend.db.repository;

import com.ssafy.backend.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByWalletAddress(String walletAddress);
}
