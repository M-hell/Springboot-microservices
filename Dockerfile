FROM ubuntu:22.04

# Install required packages
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    maven \
    nodejs \
    npm \
    curl \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Make startup script executable
RUN chmod +x startup.sh

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

WORKDIR /app

# Expose ports
# RabbitMQ: 5672, 15672
# Eureka: 8761
# Config Server: 8888
# Gateway: 8080
# User Service: 8081
# Activity Service: 8082
# AI Service: 8083
# Frontend: 3000
EXPOSE 5672 15672 8761 8888 8080 8081 8082 8083 3000

# Run startup script
CMD ["./startup.sh"]
