# Fitness App Microservices

A comprehensive fitness application built using **Spring Boot Microservices Architecture** with a **Next.js** frontend. This application helps users track their fitness activities, get AI-powered recommendations, and manage their fitness journey.

## 🏗️ Architecture Overview

This project follows a microservices architecture pattern with the following components:

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   API Gateway   │
│   (Frontend)    │    │   (Port 8080)   │
└─────────────────┘    └─────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼────┐ ┌────▼────┐ ┌────▼────┐
            │User Service│ │Activity │ │AI Service│
            │(Port 8081) │ │Service  │ │(Port    │
            │            │ │(Port    │ │8083)    │
            └────────────┘ │8082)    │ └─────────┘
                           └─────────┘
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼────┐ ┌────▼─────┐    │
            │Config      │ │Eureka    │    │
            │Server      │ │Discovery │    │
            │(Port 8888) │ │(Port 8761)│   │
            └────────────┘ └──────────┘    │
                                          │
                                   ┌──────▼──────┐
                                   │  RabbitMQ   │
                                   │ (Message    │
                                   │  Queue)     │
                                   └─────────────┘
```

## 🚀 Services

### Backend Services (Spring Boot)

1. **Config Server** (Port 8888)
   - Centralized configuration management
   - Serves configuration for all microservices
   - Built with Spring Cloud Config

2. **Eureka Discovery Server** (Port 8761)
   - Service discovery and registration
   - Load balancing capabilities
   - Health monitoring

3. **API Gateway** (Port 8080)
   - Single entry point for all client requests
   - Request routing to appropriate microservices
   - Built with Spring Cloud Gateway

4. **User Service** (Port 8081)
   - User registration and authentication
   - Profile management
   - User data persistence

5. **Activity Service** (Port 8082)
   - Fitness activity tracking
   - Activity CRUD operations
   - Activity history management

6. **AI Service** (Port 8083)
   - AI-powered fitness recommendations
   - Personalized workout suggestions
   - Health insights and analytics

### Frontend (Next.js)

- **Next.js 15** with React 19
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **Axios** for API communication

### Message Queue
- **RabbitMQ** for asynchronous communication between services

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.4**
- **Spring Cloud**
- **Spring Cloud Gateway**
- **Spring Cloud Config**
- **Netflix Eureka**
- **Maven** for dependency management

### Frontend
- **Next.js 15.4.6**
- **React 19.1.0**
- **Tailwind CSS 4**
- **Zustand 5.0.7**
- **Framer Motion 12.23.12**
- **Axios 1.11.0**

### Infrastructure
- **RabbitMQ** for message queuing
- **Docker** (containerization ready)

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **Maven 3.6** or higher
- **RabbitMQ** server
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/M-hell/Springboot-microservices.git
cd Springboot-microservices
```

### 2. Start RabbitMQ

```bash
# Using Docker
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Or start your local RabbitMQ server
```

### 3. Start Backend Services (in order)

#### Start Config Server
```bash
cd configserver
./mvnw spring-boot:run
```
Wait for the service to start on port 8888.

#### Start Eureka Discovery Server
```bash
cd eureka
./mvnw spring-boot:run
```
Wait for the service to start on port 8761.

#### Start Microservices
```bash
# User Service
cd userservice
./mvnw spring-boot:run

# Activity Service
cd activityservice
./mvnw spring-boot:run

# AI Service
cd aiservice
./mvnw spring-boot:run
```

#### Start API Gateway
```bash
cd gateway
./mvnw spring-boot:run
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## 📚 API Endpoints

### User Service (via Gateway)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Activity Service (via Gateway)
- `POST /api/activities` - Create new activity
- `GET /api/activities` - Get user activities
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### AI Service (via Gateway)
- `GET /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/analyze` - Analyze fitness data

## 🐳 Docker Deployment

### Build Docker Images
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d
```

## 🔧 Configuration

Configuration files are stored in the Config Server under `configserver/src/main/resources/config/`:
- `activityservice.yml`
- `userservice.yml`
- `aiservice.yml`
- `gateway.yml`

## 📊 Monitoring

- **Eureka Dashboard**: `http://localhost:8761`
- **RabbitMQ Management**: `http://localhost:15672` (guest/guest)
- **Application Health**: Available through Spring Boot Actuator endpoints

## 🔐 Security

- JWT-based authentication
- Secure API endpoints
- CORS configuration for frontend integration

## 🧪 Testing

### Run Backend Tests
```bash
# Run tests for each service
cd userservice && ./mvnw test
cd activityservice && ./mvnw test
cd aiservice && ./mvnw test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
├── activityservice/          # Activity management service
├── aiservice/               # AI recommendations service
├── configserver/            # Configuration server
├── eureka/                  # Service discovery
├── frontend/                # Next.js frontend application
├── gateway/                 # API Gateway
├── rabbitmq runner/         # RabbitMQ configuration
├── userservice/            # User management service
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **M-hell** - *Initial work* - [M-hell](https://github.com/M-hell)

## 🙏 Acknowledgments

- Spring Boot Team for the excellent framework
- Telusko for the educational content
- Next.js team for the amazing React framework
- All open-source contributors

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy Coding! 🚀**