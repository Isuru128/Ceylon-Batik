package com.ceylonbatik.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for auth API endpoints (stateless login/register)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                )

                // Disable Spring's built-in form login and HTTP basic so they don't
                // redirect to /login or pop up a browser auth dialog
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/login",
                                "/register.html",
                                "/register",
                                "/shop.html",
                                "/shop",
                                "/story.html",
                                "/story",
                                "/contact.html",
                                "/contact",
                                "/product-detail.html",
                                "/cart.html",
                                "/cart",
                                "/wishlist.html",
                                "/wishlist",
                                "/profile.html",
                                "/profile",
                                "/admin/**",
                                "/api/admin/**",
                                "/api/auth/**",
                                "/api/products/**",
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        ).permitAll()

                        .anyRequest()
                        .authenticated()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                );

        return http.build();
    }
}