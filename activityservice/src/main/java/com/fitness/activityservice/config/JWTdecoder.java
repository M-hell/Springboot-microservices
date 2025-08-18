package com.fitness.activityservice.config;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
@RequiredArgsConstructor
public class JWTdecoder {
    private final Dotenv dotenv = Dotenv.load(); // Load environment variables from .env file
    private String jwtSecretKey = dotenv.get("JWT_SECRET_KEY"); 

    public String decodeCookie(Cookie[] cookies) {
        try {
            if (cookies == null) {
            return null;
        }
            Cookie cookie = null;
            for (Cookie c : cookies) {
            if ("token".equals(c.getName())) {
                cookie = c;
                break;
            }
        }
            if (cookie == null || cookie.getValue() == null || cookie.getValue().isEmpty()) {
                log.warn("Cookie is null or empty");
                return null;
            }

            String token = cookie.getValue();
            log.info("Attempting to decode JWT token from cookie: {}", cookie.getName());

            // Create secret key from the JWT secret
            SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));

            // Parse and validate the JWT token
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Extract user ID from claims
            String userId = claims.get("id", String.class);
            if (userId == null || userId.isEmpty()) {
                log.warn("User ID not found in JWT claims");
                return null;
            }
            log.info("Successfully decoded JWT token, user ID: {}", userId);
            return userId;

        } catch (Exception e) {
            log.error("Failed to decode JWT token: {}", e.getMessage());
            return null;
        }
    }
}
