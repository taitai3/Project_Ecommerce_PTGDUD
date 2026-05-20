# 🛒 CellPhones - E-Commerce Platform

Dự án website thương mại điện tử bán điện thoại và phụ kiện công nghệ, được phát triển cho môn học **Phát triển giao diện người dùng (PTGDUD)** - Trường Đại học Công nghiệp TP.HCM (IUH).

## 📋 Tổng quan

Hệ thống gồm 2 phần chính:
- **Admin Panel** - Quản lý sản phẩm, đơn hàng, khách hàng, danh mục
- **Store (Cửa hàng)** - Giao diện mua sắm cho khách hàng với chatbot AI hỗ trợ

## 🛠 Công nghệ sử dụng

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 19.2 | UI Library |
| Vite | 7.x (Rolldown) | Build tool |
| TailwindCSS | 3.4 | CSS Framework |
| React Router | 7.13 | Routing |
| Axios | 1.13 | HTTP Client |
| Lucide React | 0.563 | Icon Library |
| Google Generative AI | 0.24 | Chatbot AI (Gemini) |

### Backend
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Spring Boot | 4.0.1 | Java Framework |
| Java | 17 | Ngôn ngữ |
| MySQL | 8.0+ | Database |
| Spring Security | - | Authentication & Authorization |
| JWT (jjwt) | 0.11.5 | Token-based Auth |
| Spring Data JPA | - | ORM |
| Cloudinary | 1.34 | Cloud Image Storage |
| Lombok | - | Code Generation |

## ✨ Tính năng chính

### 🏪 Store (Khách hàng)
- Xem danh sách sản phẩm, lọc theo danh mục
- Tìm kiếm sản phẩm
- Giỏ hàng (thêm, xóa, cập nhật số lượng)
- Đặt hàng và theo dõi đơn hàng
- Đăng ký / Đăng nhập
- **Chatbot AI** - Tư vấn sản phẩm thông minh (Gemini AI + Smart Fallback)

### 🔧 Admin Panel
- **Dashboard** - Thống kê tổng quan (doanh thu, đơn hàng, khách hàng)
- **Quản lý sản phẩm** - CRUD, upload ảnh lên Cloudinary, phân trang, tìm kiếm
- **Quản lý danh mục** - CRUD danh mục sản phẩm
- **Quản lý đơn hàng** - Xem, cập nhật trạng thái đơn hàng
- **Quản lý khách hàng** - Xem thông tin, chi tiết khách hàng
- **Xuất dữ liệu** - Export CSV/Excel
- **Cài đặt** - Cấu hình hệ thống

### 🔐 Bảo mật
- JWT Authentication với Access Token + Refresh Token
- Phân quyền Admin / User
- Mã hóa mật khẩu BCrypt
- CORS Configuration

## 📁 Cấu trúc dự án

```
Project_Ecommerce_PTGDUD/
├── BackEnd/                    # Spring Boot API
│   ├── src/main/java/iuh/fit/backend/
│   │   ├── config/            # Security, Cloudinary config
│   │   ├── controllers/       # REST Controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entities/          # JPA Entities
│   │   ├── repositories/      # Spring Data Repositories
│   │   ├── security/          # JWT Filter
│   │   ├── services/          # Business Logic
│   │   └── utils/             # JWT Utils
│   └── src/main/resources/
│       └── application.properties
├── FrontEnd/                   # React SPA
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout/        # Sidebar, Header, MainLayout
│   │   │   ├── store/         # ChatBot, Store components
│   │   │   └── ui/            # Button, Card
│   │   ├── config/            # Environment config
│   │   ├── context/           # React Context (Cart)
│   │   ├── pages/             # Page components
│   │   │   └── store/         # Shop, StoreLogin
│   │   ├── services/          # API services
│   │   └── utils/             # Utilities
│   └── package.json
└── README.md                   # File này
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Java** 17+
- **Maven** 3.6+
- **Node.js** 18+
- **MySQL** 8.0+
- **Tài khoản Cloudinary** (upload ảnh)
- **Gemini API Key** (chatbot AI - tùy chọn)

### 1. Cài đặt Backend

```bash
cd BackEnd

# Copy file cấu hình
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Sửa file application.properties với thông tin của bạn:
# - Database: username, password
# - JWT secret key (tối thiểu 32 ký tự)
# - Cloudinary: cloud-name, api-key, api-secret

# Chạy ứng dụng
mvn clean install
mvn spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### 2. Cài đặt Frontend

```bash
cd FrontEnd

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

### 3. Tài khoản mặc định

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 123456 |

## ⚙️ Cấu hình

### Database (MySQL)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tech_store_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Cloudinary (Upload ảnh)
1. Tạo tài khoản tại [cloudinary.com](https://cloudinary.com/)
2. Lấy thông tin từ Dashboard
3. Cập nhật vào `application.properties`:
```properties
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

### Gemini AI (Chatbot - Tùy chọn)
1. Tạo API key tại [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Cập nhật key trong `FrontEnd/src/services/geminiService.js`
3. Nếu không có key, chatbot vẫn hoạt động ở chế độ Smart Fallback (tìm kiếm sản phẩm từ database)

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/refresh-token` | Refresh JWT token |
| PUT | `/api/auth/change-password` | Đổi mật khẩu |

### Products
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products/page` | Danh sách sản phẩm (phân trang) |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |
| POST | `/api/products` | Tạo sản phẩm (Admin) |
| PUT | `/api/products/{id}` | Cập nhật sản phẩm (Admin) |
| DELETE | `/api/products/{id}` | Xóa sản phẩm (Admin) |

### Categories
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/categories` | Danh sách danh mục |
| POST | `/api/categories` | Tạo danh mục (Admin) |
| PUT | `/api/categories/{id}` | Cập nhật danh mục (Admin) |
| DELETE | `/api/categories/{id}` | Xóa danh mục (Admin) |

### Orders
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/orders` | Danh sách đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng |
| PUT | `/api/orders/{id}/status` | Cập nhật trạng thái |

### Cart
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart` | Xem giỏ hàng |
| POST | `/api/cart/items` | Thêm vào giỏ |
| PUT | `/api/cart/items/{id}` | Cập nhật số lượng |
| DELETE | `/api/cart/items/{id}` | Xóa khỏi giỏ |

### Users
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Danh sách users (Admin) |
| PUT | `/api/users/{id}` | Cập nhật user (Admin) |
| DELETE | `/api/users/{id}` | Xóa user (Admin) |

### Upload
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/simple-upload/image` | Upload ảnh lên Cloudinary |

## ⚠️ Lưu ý bảo mật

- **KHÔNG** commit file `application.properties` lên Git (chứa secret keys)
- File `.gitignore` đã được cấu hình để bỏ qua các file nhạy cảm
- Sử dụng `application.properties.example` làm template

## 👥 Thành viên

| STT | Họ và tên | MSSV |
|-----|-----------|------|
| 1 | | |

## 📄 License

Dự án phục vụ mục đích học tập - Môn Phát triển giao diện người dùng (PTGDUD), HK2 2025-2026, Trường Đại học Công nghiệp TP.HCM (IUH).
