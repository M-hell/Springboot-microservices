package com.fitness.activityservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import io.github.cdimascio.dotenv.Dotenv;

//for date and time issue 
@Configuration
@EnableMongoAuditing
@SpringBootApplication
public class ActivityserviceApplication {

	public static void main(String[] args) {
				// Load .env file
        Dotenv dotenv = Dotenv.load();

        // Make vars visible to Spring Boot
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
		SpringApplication.run(ActivityserviceApplication.class, args);
	}

}
