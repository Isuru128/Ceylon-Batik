package com.ceylonbatik.controller;

import com.ceylonbatik.dto.AuthResponse;
import com.ceylonbatik.dto.LoginRequest;
import com.ceylonbatik.dto.RegisterRequest;
import com.ceylonbatik.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ){
        try {
            return ResponseEntity.ok(
                    authService.register(request)
            );

        }catch(Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ){
        try {
            return ResponseEntity.ok(
                    authService.login(request)
            );

        }catch(Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}