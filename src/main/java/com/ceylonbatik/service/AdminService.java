package com.ceylonbatik.service;

import com.ceylonbatik.dao.AdminDao;
import com.ceylonbatik.dto.AdminDTO;
import com.ceylonbatik.dto.AdminDashboardStatsDTO;
import com.ceylonbatik.dto.AuthResponse;
import com.ceylonbatik.dto.LoginRequest;
import com.ceylonbatik.model.Admin;
import com.ceylonbatik.repository.ProductRepository;
import com.ceylonbatik.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final AdminDao adminDao;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.ceylonbatik.security.JwtUtils jwtUtils;

    public AdminService(AdminDao adminDao,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        com.ceylonbatik.security.JwtUtils jwtUtils) {
        this.adminDao = adminDao;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // ================= ADMIN AUTHENTICATION =================

    public AuthResponse login(LoginRequest request) {
        if (request.getContact() == null || request.getContact().isBlank()) {
            throw new RuntimeException("Admin username or email is required.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        String contact = request.getContact().trim();
        String password = request.getPassword().trim();

        // Search admin by username or email in MongoDB admins collection
        Admin admin = adminDao.findByUsernameOrEmail(contact)
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials."));

        if (!admin.isActive()) {
            throw new RuntimeException("Admin account is disabled.");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid admin credentials.");
        }

        admin.setLastLoginAt(LocalDateTime.now());
        adminDao.save(admin);

        log.info("Admin logged in successfully: {}", admin.getEmail());

        String token = jwtUtils.generateToken(admin.getUsername(), admin.getFullName(), admin.getEmail(), "ROLE_ADMIN");

        return new AuthResponse(
                "Admin login successful",
                admin.getFullName(),
                admin.getEmail(),
                "ROLE_ADMIN",
                token
        );
    }

    // ================= DASHBOARD STATS =================

    public AdminDashboardStatsDTO getDashboardStats() {
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByActiveTrue();
        long totalUsers = userRepository.count();

        // Example default metrics for simulated sales/orders if not yet in dedicated collection
        long totalOrders = 148;
        double totalSales = 1485900.0;
        long subscribers = 1240;

        return AdminDashboardStatsDTO.builder()
                .totalProducts(totalProducts)
                .activeProducts(activeProducts)
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalSales(totalSales)
                .subscriberCount(subscribers)
                .build();
    }

    // ================= ADMIN MANAGEMENT =================

    public AdminDTO getProfile(String usernameOrEmail) {
        Admin admin = adminDao.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found."));
        return AdminDTO.fromEntity(admin);
    }

    public List<AdminDTO> getAllAdmins() {
        return adminDao.findAll().stream()
                .map(AdminDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public AdminDTO createAdmin(Admin admin) {
        if (adminDao.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin with email " + admin.getEmail() + " already exists.");
        }
        if (adminDao.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Admin with username " + admin.getUsername() + " already exists.");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreatedAt(LocalDateTime.now());
        Admin saved = adminDao.save(admin);
        return AdminDTO.fromEntity(saved);
    }

    // ================= DEFAULT ADMIN SEEDER =================

    public void initDefaultAdmin() {
        String defaultEmail = "admin@ceylonbatik.lk";
        String defaultUsername = "admin";

        if (!adminDao.existsByEmail(defaultEmail) && !adminDao.existsByUsername(defaultUsername)) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername(defaultUsername);
            defaultAdmin.setEmail(defaultEmail);
            defaultAdmin.setFullName("Ceylon Batik Admin");
            defaultAdmin.setPassword(passwordEncoder.encode("admin123"));
            defaultAdmin.setActive(true);
            defaultAdmin.setCreatedAt(LocalDateTime.now());

            adminDao.save(defaultAdmin);
            log.info(">>> Initialized default admin credentials in MongoDB admins collection: {}", defaultEmail);
        }
    }
}
