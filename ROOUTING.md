# 🔁 ROUTING DOCUMENTATION

## 🌐 Frontend Routes

### Public Routes

-   /
-   /adminlogin
-   /admin-signup
-   /employeelogin
-   /employeesignup

### Protected Routes

-   /admindashboard (Admin)
-   /employee-dashboard (Employee)

------------------------------------------------------------------------

## 🔌 Backend API Routes

Base URL: /api

### 🔐 Authentication

-   POST /api/auth/signup
-   POST /api/auth/login

### 👨‍💼 Employee Attendance

-   POST /api/attendance/login
-   POST /api/attendance/logout
-   GET /api/attendance/my

### 👨‍💻 Admin Routes

-   GET /api/attendance/admin/attendance
-   GET /api/attendance/admin/export

------------------------------------------------------------------------

## 🔐 Middleware Protection

-   JWT verification middleware
-   Role-based authorization middleware
-   Protected API routes

Unauthorized access → 401\
Forbidden role access → 403
