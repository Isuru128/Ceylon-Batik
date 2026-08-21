package com.ceylonbatik.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "admins")
public class Admin {

    @Id
    private String id;

    @Indexed(unique = true)
    @Field("username")
    private String username;

    @Indexed(unique = true)
    @Field("email")
    private String email;

    @Field("password")
    private String password;

    @Field("full_name")
    private String fullName;

    @Field("role")
    private String role = "SUPER_ADMIN";

    @Field("active")
    private boolean active = true;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("last_login_at")
    private LocalDateTime lastLoginAt;

    public Admin() {
    }

    public Admin(String username, String email, String password, String fullName, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = (role != null && !role.isBlank()) ? role : "SUPER_ADMIN";
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }
}
