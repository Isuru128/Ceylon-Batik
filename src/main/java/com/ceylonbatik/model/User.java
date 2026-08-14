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
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Field("full_name")
    private String fullName;

    // User may register using email or phone.
    @Indexed(unique = true, sparse = true)
    @Field("email")
    private String email;

    @Field("password")
    private String password;

    @Indexed(unique = true, sparse = true)
    @Field("phone")
    private String phone;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("last_login_at")
    private LocalDateTime lastLoginAt;

    public User() {
    }

    public User(String fullName, String email, String password, String phone) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.createdAt = LocalDateTime.now();
    }
}