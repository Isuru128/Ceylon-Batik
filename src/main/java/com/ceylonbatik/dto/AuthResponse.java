package com.ceylonbatik.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String fullName;
    private String email;
    private String role;
    private String token;
    private String tokenType = "Bearer";

    public AuthResponse(String message, String fullName, String email) {
        this.message = message;
        this.fullName = fullName;
        this.email = email;
        this.role = "ROLE_USER";
        this.tokenType = "Bearer";
    }

    public AuthResponse(String message, String fullName, String email, String role, String token) {
        this.message = message;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.token = token;
        this.tokenType = "Bearer";
    }
}