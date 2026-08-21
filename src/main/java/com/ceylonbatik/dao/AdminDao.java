package com.ceylonbatik.dao;

import com.ceylonbatik.model.Admin;

import java.util.List;
import java.util.Optional;

public interface AdminDao {

    Optional<Admin> findById(String id);

    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByUsernameOrEmail(String usernameOrEmail);

    Admin save(Admin admin);

    List<Admin> findAll();

    void deleteById(String id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    long count();
}
