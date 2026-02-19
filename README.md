# Employee Attendance Automation System

**Login--Logout Tracking using Next.js & Node.js**

------------------------------------------------------------------------

##  About This Project

The **Employee Attendance Automation System** is a full-stack web
application developed to automate employee attendance tracking.

Instead of maintaining manual records, this system automatically:

-   Records employee login time\
-   Records employee logout time\
-   Calculates total working hours\
-   Displays attendance data in a secure admin dashboard

This project demonstrates real-world full-stack development skills,
secure authentication, backend automation logic, and professional UI
design.

------------------------------------------------------------------------

## Tech Stack

-   **Frontend:** Next.js (React Framework)\
-   **Backend:** Node.js + Express\
-   **Database:** MongoDB\
-   **Authentication:** JWT (JSON Web Token)\
-   **Password Security:** bcrypt\
-   **Email Service:** Nodemailer (OTP Verification)\
-   **Version Control:** GitHub

------------------------------------------------------------------------

##  User Roles

###  Employee

-   Secure login using email and password\
-   OTP verification via email\
-   Automatic login time recording\
-   Logout button to store logout time\
-   View attendance status

###  Admin

-   Secure admin login\
-   View attendance dashboard\
-   Filter attendance by employee and date\
-   View total working hours\
-   Export attendance data as CSV

------------------------------------------------------------------------

##  Core Features

###  Secure Authentication

-   JWT-based authentication\
-   Password hashing using bcrypt\
-   Protected API routes\
-   Token expiration handling\
-   Secure cookie implementation

###  Automated Attendance Logic

-   On successful login → Login time is stored automatically\
-   On logout → Logout time is stored automatically\
-   Total working hours are calculated automatically

###  Admin Dashboard

-   Professional sidebar layout\
-   Attendance table\
-   Date filtering\
-   Status badges:
    -   🟢 Present\
    -   🔴 Absent\
    -   🟡 Late\
-   CSV export functionality

###  Email OTP Verification

-   OTP sent to registered email\
-   Account verification before login\
-   Spam folder notification support

------------------------------------------------------------------------

##  Database Schema

### Attendance Collection

  Field        Type
  ------------ ----------
  employeeId   String
  name         String
  date         Date
  loginTime    DateTime
  logoutTime   DateTime
  totalHours   Number

------------------------------------------------------------------------

##  System Architecture

    Next.js (Frontend)
            ↓
    Node.js + Express (Backend API)
            ↓
    MongoDB Database

The frontend communicates with backend APIs.\
The backend handles authentication, automation logic, and database
operations.

------------------------------------------------------------------------

##  Project Structure

    Employee-Attendance-System/
    │
    ├── client/        → Next.js frontend
    ├── server/        → Node.js backend
    ├── screenshots/   → Project screenshots
    ├── README.md

------------------------------------------------------------------------

##  Setup Instructions

###  Clone the Repository

``` bash
git clone <your-repo-link>
cd Employee-Attendance-System
```

###  Setup Backend

``` bash
cd server
npm install
npm start
```

Create a `.env` file inside the `server` folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    EMAIL=your_email
    EMAIL_PASSWORD=your_app_password

###  Setup Frontend

``` bash
cd client
npm install
npm run dev
```

------------------------------------------------------------------------


##  Skills Demonstrated

-   Full-stack application development\
-   Next.js routing & API integration\
-   Backend API development with Express\
-   Database design using MongoDB\
-   Secure authentication using JWT\
-   Automation logic implementation\
-   Professional UI/UX dashboard design

------------------------------------------------------------------------

##  Developed By

**Subbu**\
Full Stack Developer (Next.js + Node.js)

------------------------------------------------------------------------

##  Conclusion

This project showcases a practical and secure employee attendance
automation system built using modern web technologies.\
It reflects strong understanding of full-stack development,
authentication mechanisms, backend logic automation, and structured
project architecture.
