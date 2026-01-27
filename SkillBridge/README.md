SkillBridge – Online Education Platform (MERN Stack)

🔗 Live Website: https://SkillBridge-frontend.vercel.app/

📌 Project Overview

SkillBridge is a fully functional Ed-Tech platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
It allows users to create, consume, purchase, and rate educational content, providing a complete learning and teaching ecosystem.
The platform is designed to:
Deliver a seamless and interactive learning experience for students
Enable instructors to create, manage, and monetize courses
Offer a scalable and secure architecture suitable for real-world deployment
🛠 Tech Stack
Frontend
React.js
Redux (State Management)
Tailwind CSS
HTML5, CSS3
Backend
Node.js
Express.js
MongoDB
Mongoose (ODM)
Authentication & Security
JWT (JSON Web Tokens)
Bcrypt (Password Hashing)
OTP Verification
Forgot Password Flow
Payments & Media
Razorpay (Payment Gateway)
Cloudinary (Media Storage)
Markdown (Course Content Formatting)
🏗 System Architecture
SkillBridge follows a client-server architecture consisting of:
Frontend (Client)
Built with React.js
Communicates with backend via REST APIs
Backend (Server)
Built using Node.js and Express.js
Handles authentication, course management, payments, and business logic
Database
MongoDB for flexible and scalable data storage
🎨 Frontend Features
Student Features

Homepage with platform overview
Browse all available courses
Wishlist functionality
Cart and secure checkout
Course consumption (videos & documents)
Profile management
Edit personal details
Instructor Features
Instructor dashboard
Course creation, update, and deletion
Manage course pricing and content
View ratings and feedback
Course performance insights
Admin Features (Future Scope)
Admin dashboard
Platform analytics
Intructor and user management
Course moderation
⚙ Backend Features
User authentication & authorization (JWT + OTP)
Role-based access (Student / Instructor)
Course CRUD operations
Course rating & reviews
Secure payment integration using Razorpay
Media storage using Cloudinary
Markdown-based course documentation
Scalable REST API architecture

🗄 Database Schema
User (Student)
Name
Email
Password
Enrolled Courses

User (Instructor)
Name
Email
Password
Created Courses

Course
Course Title
Description
Instructor Reference
Media Content

Ratings



🔌 API Design (RESTful)
Authentication APIs

POST /api/auth/signup – Register new user
POST /api/auth/login – Login user & generate JWT
POST /api/auth/verify-otp – Verify OTP
POST /api/auth/forgot-password – Reset password


Course APIs
GET /api/courses – Get all courses
GET /api/courses/:id – Get course by ID
POST /api/courses – Create a course
PUT /api/courses/:id – Update course
DELETE /api/courses/:id – Delete course
POST /api/courses/:id/rate – Rate a course



🚀 Deployment

Frontend: Deployed on Vercel
Backend: Node.js server
Database: MongoDB Atlas
Media Storage: Cloudinary

🧪 Testing
Manual API testing using Postman
Frontend component testing
Authentication and authorization flow testing


🔮 Future Enhancements

Admin panel implementation

Live classes & video conferencing
Course certificates
Instructor payout system

Advanced analytics dashboard
Mobile application (React Native)

📌 Conclusion

SkillBridge is a scalable, secure, and production-ready MERN-based Ed-Tech platform.
It demonstrates real-world features like authentication, payments, cloud storage, and role-based access, making it an ideal project for portfolios, resumes, and interviews.