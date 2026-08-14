package com.ceylonbatik.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;

    // email or phone from frontend
    private String contact;

    private String password;

    private String confirmPassword;
}