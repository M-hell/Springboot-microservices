# 🏋️‍♂️ Fitness Tracker - AI-Powered Microservices Platform

## 📋 Project Description

**Fitness Tracker** is a comprehensive, enterprise-grade fitness tracking platform built with modern **Spring Boot Microservices Architecture** and a sleek **Next.js** frontend. The application empowers users to monitor their fitness journey through intelligent activity tracking, AI-powered workout recommendations, and detailed performance analytics.

### ✨ Key Highlights
- 🎯 **Smart Activity Tracking** - Monitor 10+ fitness activities with detailed metrics
- 🤖 **AI-Powered Insights** - Google Gemini AI generates personalized workout recommendations  
- 📊 **Real-time Analytics** - Comprehensive performance dashboards and progress tracking
- 🔒 **Enterprise Security** - JWT-based authentication with role-based access control
- 🚀 **Scalable Architecture** - Cloud-ready microservices with automatic service discovery

---

## 🛠️ Technology Stack

### **Backend Services**
| Technology | Version | Purpose |
|------------|---------|---------|
| ☕ **Java** | 17 LTS | Primary programming language |
| 🍃 **Spring Boot** | 3.5.4 | Microservices framework |
| ☁️ **Spring Cloud** | 2025.0.0 | Microservices orchestration |
| 🌐 **Spring Cloud Gateway** | Latest | API Gateway & routing |
| 🔍 **Netflix Eureka** | Latest | Service discovery |
| ⚙️ **Spring Cloud Config** | Latest | Configuration management |
| 🔐 **JWT (JJWT)** | 0.12.3 | Authentication & authorization |

### **AI & Machine Learning**
| Technology | Purpose |
|------------|---------|
| 🧠 **Google Gemini AI** | Intelligent fitness analysis |
| 📈 **Custom Analytics Engine** | Performance insights |

### **Databases & Storage**
| Technology | Usage |
|------------|--------|
| 🐬 **MySQL** | User data & authentication |
| 🍃 **MongoDB** | Activity tracking & recommendations |

### **Message Queue & Communication**
| Technology | Purpose |
|------------|---------|
| 🐰 **RabbitMQ 4.x** | Asynchronous processing |
| 📡 **REST APIs** | Service communication |

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **React** | 19.1.0 | UI components |
| 📱 **Next.js** | 15.4.6 | Full-stack framework |
| 🎨 **Tailwind CSS** | 4.0 | Styling & design |
| ✨ **Framer Motion** | 12.23.12 | Animations |
| 🏪 **Zustand** | 5.0.7 | State management |

### **DevOps & Tools**
| Technology | Purpose |
|------------|---------|
| 🐳 **Docker** | Containerization |
| 📦 **Maven** | Build automation |
| 🔧 **Spring Boot Actuator** | Monitoring |

---

## 🏗️ System Architecture

### **Microservices Architecture Overview**

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

---

## 📁 Project Structure

```
fitness-app-microservices/
├── 📂 configserver/                 # 🔧 Configuration Management
│   ├── src/main/resources/config/   # Service configurations
│   ├── pom.xml                      # Maven dependencies
│   └── README.md                    # Service documentation
│
├── 📂 eureka/                       # 🔍 Service Discovery
│   ├── src/main/java/               # Eureka server implementation
│   ├── src/main/resources/          # Server configurations
│   └── pom.xml                      # Maven dependencies
│
├── 📂 gateway/                      # 🚪 API Gateway
│   ├── src/main/java/               # Gateway routing logic
│   ├── src/main/resources/          # Gateway configurations
│   └── pom.xml                      # Maven dependencies
│
├── 📂 userservice/                  # 👤 User Management
│   ├── src/main/java/com/fitness/   # User service implementation
│   │   ├── controller/              # REST controllers
│   │   ├── service/                 # Business logic
│   │   ├── model/                   # Entity models
│   │   ├── repository/              # Data access layer
│   │   └── config/                  # Security & JWT config
│   └── pom.xml                      # Maven dependencies
│
├── 📂 activityservice/              # 🏃 Activity Tracking
│   ├── src/main/java/com/fitness/   # Activity service implementation
│   │   ├── controller/              # Activity REST APIs
│   │   ├── service/                 # Activity business logic
│   │   ├── model/                   # Activity entities
│   │   └── config/                  # RabbitMQ configuration
│   └── pom.xml                      # Maven dependencies
│
├── 📂 aiservice/                    # 🤖 AI Recommendations
│   ├── src/main/java/com/fitness/   # AI service implementation
│   │   ├── service/                 # AI logic & Gemini integration
│   │   ├── model/                   # Recommendation models
│   │   ├── repository/              # MongoDB repositories
│   │   └── config/                  # AI service configuration
│   └── pom.xml                      # Maven dependencies
│
├── 📂 frontend/                     # 📱 Next.js Application
│   ├── src/app/                     # App router pages
│   │   ├── home/                    # Dashboard & activity pages
│   │   ├── register/                # User registration
│   │   ├── layout.jsx               # Root layout
│   │   └── page.jsx                 # Landing page
│   ├── src/components/              # Reusable components
│   │   ├── CreateActivity.jsx       # Activity creation form
│   │   ├── Header.jsx               # Navigation header
│   │   └── ui/                      # UI components
│   ├── src/lib/                     # Utility functions
│   ├── src/zustand/                 # State management
│   ├── package.json                 # Node dependencies
│   └── tailwind.config.js           # Styling configuration
│
├── 📂 rabbitmq runner/              # 🐰 Message Queue Setup
│   └── container runner.txt         # Docker run commands
│
└── 📄 README.md                     # Project documentation
```

---

## 🚀 Microservices Overview

### 🔧 **Config Server** `Port: 8888`
**Purpose**: Centralized configuration management hub for all microservices

- **🎯 Core Function**: Serves configuration files for all services from single location
- **📁 Configuration Storage**: Native file system with classpath-based configs
- **🔄 Hot Reload**: Dynamic configuration updates without service restarts
- **🌍 Environment Support**: Dev, staging, and production environment configs

**Key Features:**
- ✅ Centralized config management  
- ✅ Version-controlled configurations
- ✅ Environment-specific settings
- ✅ Native file system storage

---

### 🔍 **Eureka Discovery Server** `Port: 8761`
**Purpose**: Service registry and discovery with intelligent load balancing

- **📋 Service Registry**: Automatic registration and deregistration of services
- **⚖️ Load Balancing**: Client-side load balancing with health checks  
- **💓 Health Monitoring**: Real-time service health status tracking
- **🖥️ Web Dashboard**: Interactive dashboard at `http://localhost:8761`

**Key Features:**
- ✅ Automatic service discovery
- ✅ Health status monitoring  
- ✅ Self-preservation mode
- ✅ RESTful service registry API

---

### 🚪 **API Gateway** `Port: 8080`
**Purpose**: Unified entry point with intelligent request routing

- **🛣️ Request Routing**: Smart routing based on URL patterns
- **🔒 Security Layer**: Centralized authentication and authorization
- **⚡ Load Balancing**: Distributes requests across service instances
- **🛡️ Rate Limiting**: Request throttling and circuit breaker patterns

**Routing Configuration:**
```
/api/users/**      → User Service (8081)
/api/activities/** → Activity Service (8082)  
/api/ai/**         → AI Service (8083)
```

---

### 👤 **User Service** `Port: 8081`
**Purpose**: Complete user lifecycle and authentication management

- **🔐 Authentication**: JWT-based secure user authentication
- **👥 User Management**: Registration, login, profile management
- **🗄️ Database**: MySQL with JPA/Hibernate ORM
- **🛡️ Security**: Password encryption and role-based access control

**API Endpoints:**
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication  
- `GET /api/users/profile` - Retrieve user profile
- `PUT /api/users/profile` - Update user information

---

### 🏃 **Activity Service** `Port: 8082`  
**Purpose**: Comprehensive fitness activity tracking and management

- **📊 Activity Tracking**: Support for 10+ activity types (Running, Cycling, Yoga, etc.)
- **📨 Message Publishing**: RabbitMQ integration for AI processing pipeline
- **🗄️ Database**: MongoDB for flexible activity data storage
- **📈 Metrics**: Custom activity metrics and performance tracking

**Supported Activity Types:**
`RUNNING` • `WALKING` • `CYCLING` • `SWIMMING` • `WEIGHT_TRAINING` • `YOGA` • `HIIT` • `CARDIO` • `STRETCHING` • `OTHER`

**API Endpoints:**
- `POST /api/activities` - Create new activity
- `GET /api/activities` - Get user activities
- `GET /api/activities/{id}` - Get specific activity
- `PUT /api/activities/{id}` - Update activity

---

### 🤖 **AI Service** `Port: 8083`
**Purpose**: Intelligent fitness analysis and personalized recommendations

- **🧠 Google Gemini AI**: Advanced natural language processing for fitness analysis
- **📊 Performance Analysis**: Comprehensive workout performance evaluation  
- **💡 Smart Recommendations**: Personalized workout suggestions and improvements
- **🔄 Async Processing**: RabbitMQ message consumption for scalable AI processing

**AI Capabilities:**
- ✅ Workout performance analysis
- ✅ Personalized improvement suggestions  
- ✅ Safety guidelines generation
- ✅ Next workout recommendations

---

## 📱 Frontend Application

### **Next.js 15 + React 19 Architecture**
- **🎨 Modern UI**: Tailwind CSS 4 with custom design system
- **✨ Smooth Animations**: Framer Motion for enhanced user experience
- **🏪 State Management**: Zustand for lightweight global state
- **📱 Responsive Design**: Mobile-first approach with desktop optimization

### **Key Pages & Components**
```
🏠 Dashboard           → Activity overview and quick actions
📝 Add Activity        → Activity creation form with AI integration  
📊 All Activities      → Comprehensive activity history
🤖 AI Recommendations  → Personalized fitness insights
👤 User Profile        → Account management and settings
```

---

## 💾 Database Architecture

### **Hybrid Database Strategy**
```
┌─────────────────┐         ┌─────────────────┐
│   🐬 MySQL      │         │   🍃 MongoDB    │
│                 │         │                 │
│ • User Data     │         │ • Activities    │
│ • Authentication│         │ • Recommendations│
│ • Profiles      │         │ • Dynamic Metrics│
│ • Roles         │         │ • AI Responses  │
└─────────────────┘         └─────────────────┘
```

**MySQL (Relational Data)**
- User accounts and authentication
- Structured profile information  
- Role-based access control

**MongoDB (Document-Oriented)**
- Flexible activity data with dynamic fields
- AI recommendations and analysis results
- Custom metrics and performance data

---

## 🐰 Message Queue Architecture

### **RabbitMQ Integration Flow**
```
Activity Created → Activity Service → RabbitMQ Queue → AI Service → Process & Store
                                  ↓
                              📨 Message
                          {fitness.exchange}
                               ↓
                         🗂️ activity.queue  
                               ↓
                          🤖 AI Processing
                               ↓
                         💾 Save Recommendation
```

**Message Flow:**
1. User creates activity → Activity Service
2. Service publishes message → RabbitMQ Exchange  
3. Message routed to queue → activity.queue
4. AI Service consumes message → Gemini AI Processing
5. AI generates recommendation → MongoDB Storage

---

## 🚀 Getting Started

### **Prerequisites**
```bash
☕ Java 17+
📦 Maven 3.6+  
🐰 RabbitMQ Server
🐬 MySQL 8.0+
🍃 MongoDB 4.4+
📱 Node.js 18+
```

### **Quick Start Guide**

#### **1️⃣ Clone Repository**
```bash
git clone https://github.com/M-hell/Springboot-microservices.git
cd Springboot-microservices
```

#### **2️⃣ Start Infrastructure Services**
```bash
# Start RabbitMQ (Docker)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# Start MySQL and MongoDB (ensure they're running)
```

#### **3️⃣ Launch Backend Services (In Order)**
```bash
# 1. Config Server
cd configserver && ./mvnw spring-boot:run

# 2. Eureka Discovery
cd eureka && ./mvnw spring-boot:run  

# 3. Microservices
cd userservice && ./mvnw spring-boot:run
cd activityservice && ./mvnw spring-boot:run
cd aiservice && ./mvnw spring-boot:run

# 4. API Gateway
cd gateway && ./mvnw spring-boot:run
```

#### **4️⃣ Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **🌐 Access Points**
| Service | URL | Purpose |
|---------|-----|---------|
| 📱 **Frontend** | `http://localhost:3000` | Main application |
| 🚪 **API Gateway** | `http://localhost:8080` | API endpoints |
| 🔍 **Eureka Dashboard** | `http://localhost:8761` | Service monitoring |
| 🐰 **RabbitMQ Management** | `http://localhost:15672` | Queue management |

---

## 🔒 Security Features

### **JWT Authentication Flow**
```
User Login → Credentials Validation → JWT Token Generation → Secure Cookie Storage
                                                              ↓
Protected Route Access → Token Validation → Service Authorization → Resource Access
```

**Security Layers:**
- 🔐 **JWT Tokens**: Stateless authentication with JJWT library
- 🍪 **Secure Cookies**: HTTP-only cookies for token storage
- 🛡️ **Password Encryption**: BCrypt hashing for user passwords
- 🔑 **Role-Based Access**: User and Admin role management
- 🚪 **API Protection**: Gateway-level request validation

---

## 📊 Monitoring & Observability

### **Health Check Endpoints**
```
🔧 Config Server:    /actuator/health
🔍 Eureka:           /actuator/health  
🚪 Gateway:          /actuator/health
👤 User Service:     /actuator/health
🏃 Activity Service: /actuator/health
🤖 AI Service:       /actuator/health
```

### **Dashboard Access**
- **📈 Eureka Dashboard**: Real-time service status and registration
- **🐰 RabbitMQ Management**: Queue monitoring and message tracking
- **📊 Spring Boot Actuator**: Detailed health metrics and endpoints

---

## 🐳 Docker Deployment

### **Container Architecture**
```bash
# Individual service containers
docker build -t fitness-config ./configserver
docker build -t fitness-eureka ./eureka  
docker build -t fitness-gateway ./gateway
docker build -t fitness-user ./userservice
docker build -t fitness-activity ./activityservice
docker build -t fitness-ai ./aiservice

# Frontend container  
docker build -t fitness-frontend ./frontend
```

### **Docker Compose Deployment**
```yaml
# Complete stack deployment
docker-compose up -d

# Services included:
# - All microservices
# - MySQL & MongoDB  
# - RabbitMQ
# - Frontend application
```

---

## 🎯 Key Features Showcase

### **🤖 AI-Powered Insights**
- Intelligent workout analysis using Google Gemini AI
- Personalized improvement suggestions based on performance
- Safety guidelines for different activity types
- Custom recommendations for fitness progression

### **📊 Comprehensive Analytics**  
- Real-time activity tracking with detailed metrics
- Progress visualization and performance trends
- Calorie tracking and fitness goal monitoring
- Historical data analysis and insights

### **🔄 Scalable Architecture**
- Microservices design for horizontal scaling
- Service discovery for dynamic load balancing  
- Asynchronous processing for optimal performance
- Cloud-ready containerized deployment

### **🎨 Modern User Experience**
- Responsive design optimized for all devices
- Smooth animations and intuitive navigation
- Real-time updates and instant feedback
- Progressive Web App capabilities

---

## 🤝 Contributing

### **Development Workflow**
1. **🔀 Fork** the repository
2. **🌿 Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** Pull Request

### **Code Standards**
- ☕ Follow Java coding conventions
- ⚛️ Use React best practices
- 📝 Write comprehensive tests
- 📋 Update documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**M-hell** - *Full Stack Developer*  
🔗 GitHub: [@M-hell](https://github.com/M-hell)  
📧 Email: [Contact](mailto:your-email@example.com)

---

## 🙏 Acknowledgments

- **🍃 Spring Boot Team** - Excellent microservices framework
- **⚛️ Next.js Community** - Amazing React framework
- **🧠 Google Gemini AI** - Powerful AI integration capabilities  
- **🎓 Telusko** - Educational guidance and inspiration
- **🌟 Open Source Community** - Continuous learning and improvement

---

<div align="center">

### 🚀 **Ready to Transform Your Fitness Journey?**

**[⭐ Star this repository](https://github.com/M-hell/Springboot-microservices)** • **[📋 Report Issues](https://github.com/M-hell/Springboot-microservices/issues)** • **[🤝 Contribute](https://github.com/M-hell/Springboot-microservices/pulls)**

---

**Made with ❤️ for the fitness community | Powered by Spring Boot & Next.js**

</div>