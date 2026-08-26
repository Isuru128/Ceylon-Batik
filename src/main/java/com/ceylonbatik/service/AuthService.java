package com.ceylonbatik.service;

import com.ceylonbatik.dto.AuthResponse;
import com.ceylonbatik.dto.LoginRequest;
import com.ceylonbatik.dto.RegisterRequest;
import com.ceylonbatik.model.User;
import com.ceylonbatik.repository.UserRepository;
import com.ceylonbatik.util.ContactUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.ceylonbatik.security.JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       com.ceylonbatik.security.JwtUtils jwtUtils) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // ================= REGISTER =================

    public AuthResponse register(RegisterRequest request) {

        if (request.getFullName() == null || request.getFullName().isBlank()
                || request.getContact() == null || request.getContact().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {

            throw new RuntimeException("All fields are required.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        String contact = request.getContact().trim();

        User user = new User();
        user.setFullName(request.getFullName().trim());

        if (ContactUtils.isEmail(contact)) {

            if (userRepository.existsByEmail(contact)) {
                throw new RuntimeException("Email is already registered.");
            }

            user.setEmail(contact);

        } else if (ContactUtils.isPhone(contact)) {

            if (userRepository.existsByPhone(contact)) {
                throw new RuntimeException("Phone number is already registered.");
            }

            user.setPhone(contact);

        } else {
            throw new RuntimeException("Invalid email or phone number.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        String userContact = user.getEmail() != null ? user.getEmail() : user.getPhone();
        String token = jwtUtils.generateToken(userContact, user.getFullName(), user.getEmail(), "ROLE_USER");

        return new AuthResponse(
                "Registration successful",
                user.getFullName(),
                userContact,
                "ROLE_USER",
                token
        );
    }

    // ================= LOGIN =================

    public AuthResponse login(LoginRequest request) {

        if (request.getContact() == null || request.getContact().isBlank()) {
            throw new RuntimeException("Email or phone number is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        String contact = request.getContact().trim();

        User user;

        if (ContactUtils.isEmail(contact)) {

            user = userRepository.findByEmail(contact)
                    .orElseThrow(() ->
                            new RuntimeException("Invalid email/phone number or password."));

        } else if (ContactUtils.isPhone(contact)) {

            user = userRepository.findByPhone(contact)
                    .orElseThrow(() ->
                            new RuntimeException("Invalid email/phone number or password."));

        } else {

            throw new RuntimeException("Invalid email or phone number.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email/phone number or password.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String userContact = user.getEmail() != null ? user.getEmail() : user.getPhone();
        String token = jwtUtils.generateToken(userContact, user.getFullName(), user.getEmail(), "ROLE_USER");

        return new AuthResponse(
                "Login successful",
                user.getFullName(),
                userContact,
                "ROLE_USER",
                token
        );
    }
}