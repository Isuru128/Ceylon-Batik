package com.ceylonbatik.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private String fullName;
    private String email;
    private String role;

    public AuthResponse(String message, String fullName, String email) {
        this.message = message;
        this.fullName = fullName;
        this.email = email;
        this.role = "USER";
    }
}