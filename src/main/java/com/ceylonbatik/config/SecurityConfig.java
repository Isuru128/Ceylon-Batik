package com.ceylonbatik.config;

import com.ceylonbatik.security.JwtAuthenticationEntryPoint;
import com.ceylonbatik.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for stateless REST endpoints
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))

                // Disable Spring's built-in form login and HTTP basic dialogs
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // Stop private data caching on responses
                .headers(headers -> headers
                        .cacheControl(Customizer.withDefaults())
                )

                // Exception handling for unauthorized API requests
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )

                // Stateless session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // Public Auth APIs
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/login").permitAll()

                        // Public product viewing
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // Admin protected APIs (verified via admin JWT token)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // Static resources and view pages
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
                                "/css/**",
                                "/js/**",
                                "/images/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                // Register JWT authentication filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}