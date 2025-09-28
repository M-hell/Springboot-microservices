package com.fitness.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class UserserviceApplication {

	public static void main(String[] args) {
		// Load .env file
        Dotenv dotenv = Dotenv.load();

        // Make vars visible to Spring Boot
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
		SpringApplication.run(UserserviceApplication.class, args);
	}

}
