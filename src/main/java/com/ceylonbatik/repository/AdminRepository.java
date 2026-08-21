package com.ceylonbatik.repository;

import com.ceylonbatik.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {

    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);

    @Query("{ '$or': [ { 'username': ?0 }, { 'email': ?0 } ] }")
    Optional<Admin> findByUsernameOrEmail(String usernameOrEmail);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
