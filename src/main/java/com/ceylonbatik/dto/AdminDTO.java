package com.ceylonbatik.dto;

import com.ceylonbatik.model.Admin;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {

    private String id;
    private String username;
    private String email;
    private String fullName;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public static AdminDTO fromEntity(Admin admin) {
        if (admin == null) {
            return null;
        }
        return new AdminDTO(
                admin.getId(),
                admin.getUsername(),
                admin.getEmail(),
                admin.getFullName(),
                admin.isActive(),
                admin.getCreatedAt(),
                admin.getLastLoginAt()
        );
    }
}
