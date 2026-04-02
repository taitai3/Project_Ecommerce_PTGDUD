# Backend Setup Instructions

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Cloudinary account (for image uploads)

## Configuration Setup

### 1. Database Setup
Create a MySQL database named `tech_store_db` or let the application create it automatically.

### 2. Application Configuration
1. Copy `src/main/resources/application.properties.example` to `src/main/resources/application.properties`
2. Update the configuration values:

```properties
# Database Configuration
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

# JWT Configuration - IMPORTANT: Use a secure secret key (minimum 32 characters)
jwt.secret=your_secure_jwt_secret_key_here_minimum_32_characters

# Cloudinary Configuration (for image uploads)
cloudinary.cloud-name=your_cloudinary_cloud_name
cloudinary.api-key=your_cloudinary_api_key
cloudinary.api-secret=your_cloudinary_api_secret
```

### 3. Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the Dashboard
3. Create a folder named `my-ecommerce` in your Cloudinary media library (optional)

### 4. Default Admin Account
The application will create a default admin account:
- Username: `admin`
- Password: `123456`

## Running the Application

```bash
# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/refresh` - Refresh JWT token

### Products
- GET `/api/products` - Get all products (with pagination)
- POST `/api/products` - Create product (Admin only)
- PUT `/api/products/{id}` - Update product (Admin only)
- DELETE `/api/products/{id}` - Delete product (Admin only)

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (Admin only)
- PUT `/api/categories/{id}` - Update category (Admin only)
- DELETE `/api/categories/{id}` - Delete category (Admin only)

### Users/Customers
- GET `/api/users` - Get all users (Admin only)
- PUT `/api/users/{id}` - Update user (Admin only)
- DELETE `/api/users/{id}` - Delete user (Admin only)

### Image Upload
- POST `/api/simple-upload/image` - Upload image to Cloudinary

## Security Notes

⚠️ **IMPORTANT**: Never commit `application.properties` to version control as it contains sensitive information like JWT secrets and API keys.

The `.gitignore` file is configured to prevent accidental commits of sensitive configuration files.