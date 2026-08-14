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

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

        return new AuthResponse(
                "Registration successful",
                user.getFullName(),
                user.getEmail() != null ? user.getEmail() : user.getPhone()
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

        return new AuthResponse(
                "Login successful",
                user.getFullName(),
                user.getEmail() != null ? user.getEmail() : user.getPhone()
        );
    }

    // ================= ADMIN LOGIN =================

    public AuthResponse adminLogin(LoginRequest request) {

        if (request.getContact() == null || request.getContact().isBlank()) {
            throw new RuntimeException("Admin email or username is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        String contact = request.getContact().trim();
        String password = request.getPassword().trim();

        // Default super admin login check
        if (("admin@ceylonbatik.lk".equalsIgnoreCase(contact) || "admin".equalsIgnoreCase(contact))
                && ("admin123".equals(password) || "admin".equals(password))) {
            return new AuthResponse("Admin login successful", "Ceylon Batik Admin", "admin@ceylonbatik.lk", "ADMIN");
        }

        // Database user admin lookup fallback
        User user = null;
        if (ContactUtils.isEmail(contact)) {
            user = userRepository.findByEmail(contact).orElse(null);
        } else if (ContactUtils.isPhone(contact)) {
            user = userRepository.findByPhone(contact).orElse(null);
        }

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            return new AuthResponse("Admin login successful", user.getFullName(), user.getEmail() != null ? user.getEmail() : user.getPhone(), "ADMIN");
        }

        throw new RuntimeException("Invalid admin credentials or unauthorized access.");
    }
}