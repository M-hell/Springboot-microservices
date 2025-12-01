package com.fitness.userservice.config;

import org.springframework.stereotype.Component;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class JWTcookie {
    
    private final Dotenv dotenv = Dotenv.load(); // Load environment variables from .env file
    private String jwtSecretKey = dotenv.get("JWT_SECRET_KEY"); 
    
    public Cookie createCookie(String userId) {
        // Create secret key from the JWT secret
        SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
        
        // Create JWT token with user ID using modern JJWT API
        String token = Jwts.builder()
                .claim("id", userId)
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + (2 * 24 * 60 * 60 * 1000))) // 2 days
                .signWith(key)
                .compact();
        
        // Create and return cookie
        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to false for HTTP (VM environment)
        cookie.setPath("/");
        cookie.setMaxAge(2 * 24 * 60 * 60); // 2 days in seconds
        
        return cookie;
    }
}