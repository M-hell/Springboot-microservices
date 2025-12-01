#!/bin/bash

echo "=========================================="
echo "Starting Fitness App Microservices"
echo "=========================================="

# Step 1: Clean up and start RabbitMQ
echo ""
echo "[1/8] Starting RabbitMQ..."
echo "----------------------------------------"
docker stop rabbitmq 2>/dev/null || true
docker rm -f rabbitmq 2>/dev/null || true
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
echo "RabbitMQ started. Waiting 15 seconds for it to be ready..."

# Step 2: Start Eureka Server
echo ""
echo "[2/8] Starting Eureka Server..."
echo "----------------------------------------"
cd eureka
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "Eureka Server starting... Waiting 20 seconds..."
cd ..

# Step 3: Start Config Server
echo ""
echo "[3/8] Starting Config Server..."
echo "----------------------------------------"
cd configserver
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "Config Server starting... Waiting 15 seconds..."
cd ..

# Step 4: Start Gateway
echo ""
echo "[4/8] Starting Gateway..."
echo "----------------------------------------"
cd gateway
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "Gateway starting... Waiting 10 seconds..."
cd ..

# Step 5: Start User Service
echo ""
echo "[5/8] Starting User Service..."
echo "----------------------------------------"
cd userservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "User Service starting... Waiting 10 seconds..."
cd ..

# Step 6: Start Activity Service
echo ""
echo "[6/8] Starting Activity Service..."
echo "----------------------------------------"
cd activityservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "Activity Service starting... Waiting 10 seconds..."
cd ..

# Step 7: Start AI Service
echo ""
echo "[7/8] Starting AI Service..."
echo "----------------------------------------"
cd aiservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
echo "AI Service starting... Waiting 10 seconds..."
cd ..

# Step 8: Build and Start Frontend
echo ""
echo "[8/8] Starting Frontend..."
echo "----------------------------------------"
cd frontend
docker stop fitness-frontend 2>/dev/null || true
docker rm -f fitness-frontend 2>/dev/null || true
npm run build
npm run start &
cd ..

echo ""
echo "=========================================="
echo "All services started!"
echo "=========================================="
echo ""
echo "RabbitMQ: http://localhost:15672 (guest/guest)"
echo "Eureka: http://localhost:8761"
echo "Frontend: http://localhost:3000"
echo ""

# Keep the script running
tail -f /dev/null
