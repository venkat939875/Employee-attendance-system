# Routing Architecture Documentation

Employee Attendance Automation System\
(Login--Logout Tracking using Next.js & Node.js)

------------------------------------------------------------------------

## 1️⃣ System Overview

This document explains the complete routing architecture of the system,
including:

-   Frontend routes (Next.js)
-   Backend API routes (Express)
-   Authentication flow
-   Attendance automation flow
-   Middleware protection
-   Request--Response lifecycle

------------------------------------------------------------------------

# 2️⃣ Overall System Architecture

    User (Browser)
          ↓
    Next.js Frontend (Client)
          ↓  (API Calls)
    Node.js + Express Backend (Server)
          ↓
    MongoDB Database

The frontend communicates with backend APIs.\
The backend processes authentication, attendance logic, and database
operations.

------------------------------------------------------------------------

# 3️⃣ Frontend Routing (Next.js)

## 🔓 Public Routes

  Route          Description
  -------------- -----------------------
  /login         Employee login page
  /signup        Employee registration
  /verify-otp    OTP verification page
  /admin/login   Admin login page

These routes do not require JWT authentication.

------------------------------------------------------------------------

## 🔐 Protected Routes

  Route        Description          Access Level
  ------------ -------------------- --------------
  /dashboard   Employee dashboard   Employee
  /admin       Admin dashboard      Admin

### Route Protection Logic

1.  After successful login → JWT token is generated.
2.  Token is stored securely.
3.  Middleware checks token validity.
4.  If token is valid → Access granted.
5.  If invalid/expired → Redirect to login.

------------------------------------------------------------------------

# 4️⃣ Backend API Routing (Express)

## 🔐 Authentication APIs

  Method   Endpoint                Description
  -------- ----------------------- -------------------
  POST     /api/auth/signup        Register employee
  POST     /api/auth/login         Employee login
  POST     /api/auth/admin-login   Admin login
  POST     /api/auth/verify-otp    Verify email OTP

### Login Flow

    Client sends credentials
            ↓
    Password validated using bcrypt
            ↓
    JWT token generated
            ↓
    Login time stored in database
            ↓
    Token returned to client

------------------------------------------------------------------------

## ⏱ Attendance APIs

  Method   Endpoint                 Description
  -------- ------------------------ -------------------------------------
  POST     /api/attendance/login    Store login time
  POST     /api/attendance/logout   Store logout time & calculate hours
  GET      /api/attendance          Get attendance records
  GET      /api/attendance/filter   Filter attendance by date/employee

------------------------------------------------------------------------

# 5️⃣ Login--Logout Automation Flow

## ✅ Login Automation

1.  Employee enters credentials.
2.  Backend verifies credentials.
3.  JWT token generated.
4.  Attendance record created:
    -   loginTime = current time
    -   date = current date
5.  User redirected to dashboard.

------------------------------------------------------------------------

## 🚪 Logout Automation

1.  User clicks logout.
2.  Backend stores logoutTime.
3.  System calculates:

```{=html}
<!-- -->
```
    totalHours = logoutTime - loginTime

4.  Attendance record updated in MongoDB.

------------------------------------------------------------------------

# 6️⃣ Middleware Architecture

All protected routes use JWT verification middleware.

### Middleware Flow

    Incoming Request
            ↓
    JWT Verification Middleware
            ↓
    If Valid → Continue to Controller
    If Invalid → Return 401 Unauthorized

This ensures only authenticated users can access protected resources.

------------------------------------------------------------------------

# 7️⃣ Request--Response Lifecycle

    Browser
       ↓
    Next.js Page
       ↓ (API call)
    Express Route
       ↓
    JWT Middleware
       ↓
    Controller Logic
       ↓
    MongoDB Query
       ↓
    Response sent back to client

------------------------------------------------------------------------

# 8️⃣ Security Considerations

-   JWT authentication
-   Password hashing using bcrypt
-   Protected routes
-   Token expiration handling
-   Secure cookie implementation
-   Input validation

------------------------------------------------------------------------

## Conclusion

This routing architecture demonstrates structured frontend routing,
secure backend API handling, middleware protection, and automated
attendance logic within a full-stack Next.js and Node.js application.
