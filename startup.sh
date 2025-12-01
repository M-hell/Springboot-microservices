#!/bin/bash

echo "=========================================="
echo "Starting Fitness App Microservices"
echo "=========================================="

# Step 1: Start RabbitMQ
echo ""
echo "[1/7] Starting RabbitMQ..."
echo "----------------------------------------"
docker stop rabbitmq 2>/dev/null || true
docker rm -f rabbitmq 2>/dev/null || true
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
echo "RabbitMQ started."

# Step 2: Start Eureka Server
echo ""
echo "[2/7] Starting Eureka Server..."
echo "----------------------------------------"
cd eureka
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

# Step 3: Start Config Server
echo ""
echo "[3/7] Starting Config Server..."
echo "----------------------------------------"
cd configserver
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

# Step 4: Start Gateway
echo ""
echo "[4/7] Starting Gateway..."
echo "----------------------------------------"
cd gateway
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

# Step 5: Start User Service
echo ""
echo "[5/7] Starting User Service..."
echo "----------------------------------------"
cd userservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

# Step 6: Start Activity Service
echo ""
echo "[6/7] Starting Activity Service..."
echo "----------------------------------------"
cd activityservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

# Step 7: Start AI Service
echo ""
echo "[7/7] Starting AI Service..."
echo "----------------------------------------"
cd aiservice
nohup mvn spring-boot:run > springboot.log 2>&1 &
cd ..

echo ""
echo "=========================================="
echo "All services started!"
echo "=========================================="
echo ""
echo "RabbitMQ: http://localhost:15672 (guest/guest)"
echo "Eureka: http://localhost:8761"
echo ""
