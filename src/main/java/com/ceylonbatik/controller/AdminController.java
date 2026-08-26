package com.ceylonbatik.controller;

import com.ceylonbatik.dto.AdminDTO;
import com.ceylonbatik.dto.AdminDashboardStatsDTO;
import com.ceylonbatik.dto.AuthResponse;
import com.ceylonbatik.dto.LoginRequest;
import com.ceylonbatik.model.Admin;
import com.ceylonbatik.model.Product;
import com.ceylonbatik.model.User;
import com.ceylonbatik.repository.UserRepository;
import com.ceylonbatik.service.AdminService;
import com.ceylonbatik.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final UserRepository userRepository;
    private final com.ceylonbatik.security.UserRequestContext userRequestContext;

    public AdminController(AdminService adminService,
                           ProductService productService,
                           UserRepository userRepository,
                           com.ceylonbatik.security.UserRequestContext userRequestContext) {
        this.adminService = adminService;
        this.productService = productService;
        this.userRepository = userRepository;
        this.userRequestContext = userRequestContext;
    }

    // ================= ADMIN LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = adminService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ================= CURRENT REQUEST CONTEXT =================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdminContext() {
        return ResponseEntity.ok(Map.of(
                "username", userRequestContext.getUsername() != null ? userRequestContext.getUsername() : "",
                "email", userRequestContext.getEmail() != null ? userRequestContext.getEmail() : "",
                "role", userRequestContext.getRole() != null ? userRequestContext.getRole() : "",
                "authenticated", userRequestContext.isAuthenticated(),
                "requestTime", userRequestContext.getRequestTimestamp().toString()
        ));
    }

    // ================= DASHBOARD METRICS =================

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ================= ADMIN PROFILE =================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam(required = false) String contact) {
        try {
            String queryContact = (contact != null && !contact.isBlank())
                    ? contact
                    : userRequestContext.getUsername();
            if (queryContact == null || queryContact.isBlank()) {
                queryContact = userRequestContext.getEmail();
            }
            AdminDTO profile = adminService.getProfile(queryContact);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            AdminDTO created = adminService.createAdmin(admin);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ================= PRODUCTS MANAGEMENT =================

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    // ================= USERS MANAGEMENT =================

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> safeUsers = users.stream().map(u -> Map.<String, Object>of(
                "id", u.getId() != null ? u.getId() : "",
                "fullName", u.getFullName() != null ? u.getFullName() : "",
                "email", u.getEmail() != null ? u.getEmail() : "",
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
        )).collect(Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }
}
