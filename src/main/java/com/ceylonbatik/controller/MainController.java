package com.ceylonbatik.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    // Home
    @GetMapping({"", "/", "/index", "/index.html"})
    public String home() {
        return "index";
    }

    // Authentication
    @GetMapping({"/login", "/login.html"})
    public String login() {
        return "login";
    }

    @GetMapping({"/register", "/register.html"})
    public String register() {
        return "register";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    // Shop
    @GetMapping({"/shop", "/shop.html"})
    public String shop() {
        return "shop";
    }

    // Our Story
    @GetMapping({"/story", "/story.html"})
    public String story() {
        return "story";
    }

    // Contact
    @GetMapping({"/contact", "/contact.html"})
    public String contact() {
        return "contact";
    }

    // Wishlist
    @GetMapping({"/wishlist", "/wishlist.html"})
    public String wishlist() {
        return "wishlist";
    }

    // Shopping Cart
    @GetMapping({"/cart", "/cart.html"})
    public String cart() {
        return "cart";
    }

    // User Profile
    @GetMapping({"/profile", "/profile.html"})
    public String profile() {
        return "profile";
    }

    // Product Detail
    @GetMapping({"/product-detail", "/product-detail.html"})
    public String productDetail() {
        return "product-detail";
    }

    // Admin Dashboard
    @GetMapping({"/admin", "/admin/", "/admin/dashboard", "/admin/dashboard.html"})
    public String adminDashboard() {
        return "admin/dashboard";
    }

    // Admin Login
    @GetMapping({"/admin/login", "/admin/login.html"})
    public String adminLogin() {
        return "admin/login";
    }
}