package com.ceylonbatik.config;

import com.ceylonbatik.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final AdminService adminService;

    public AdminDataInitializer(AdminService adminService) {
        this.adminService = adminService;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            adminService.initDefaultAdmin();
        } catch (Exception e) {
            log.warn("Failed to initialize default admin account (MongoDB may not be connected yet): {}", e.getMessage());
        }
    }
}
