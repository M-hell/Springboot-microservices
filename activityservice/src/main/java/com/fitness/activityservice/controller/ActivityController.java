package com.fitness.activityservice.controller;

import com.fitness.activityservice.config.JWTdecoder;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private JWTdecoder jwtDecoder;

    //add a new activity
    @PostMapping
    public ResponseEntity<?> trackActivity(
            @RequestBody ActivityRequest request,
            HttpServletRequest httpRequest) {

        Cookie[] cookies = httpRequest.getCookies();
        
        // decode using full Cookie object
        String userId = jwtDecoder.decodeCookie(cookies);
        if (userId == null) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        request.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    //get all activities for a user
    @GetMapping
    public ResponseEntity<?> getUserActivities(HttpServletRequest httpRequest){
        Cookie[] cookies = httpRequest.getCookies();
        
        // decode using full Cookie object
        String userId = jwtDecoder.decodeCookie(cookies);
        if (userId == null) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }


    //get activity by ID
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String activityId){
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }
}