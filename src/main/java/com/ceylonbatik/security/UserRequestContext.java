package com.ceylonbatik.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.time.LocalDateTime;

/**
 * Request-scoped bean holding authenticated user identity and context for the current HTTP request.
 * Automatically instantiated at the start of each request and destroyed at request completion,
 * avoiding any global or static variables.
 */
@Component
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Getter
@Setter
public class UserRequestContext {

    private String userId;
    private String username;
    private String email;
    private String role;
    private boolean authenticated;
    private LocalDateTime requestTimestamp = LocalDateTime.now();

    public void clear() {
        this.userId = null;
        this.username = null;
        this.email = null;
        this.role = null;
        this.authenticated = false;
    }
}
