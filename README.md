<<<<<<< HEAD
﻿# SkillBridge 🎓

A modern, full-stack ed-tech platform that empowers learners and instructors to connect, create, and grow together.

**Live Demo:** [https://skill-bridge-l4na.vercel.app/](https://skill-bridge-l4na.vercel.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Payment Integration](#payment-integration)
- [Email Templates](#email-templates)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### For Students
- 📚 Browse and enroll in courses across multiple categories
- 🛒 Shopping cart functionality with course management
- 💳 Secure payment processing via Razorpay
- 📊 Track learning progress and complete assignments
- 👤 Personalized profile management
- 🔐 Secure authentication with JWT tokens

### For Instructors
- 📝 Create and manage courses with multiple sections
- 🎥 Upload video content and course materials
- 📈 Track student enrollment and course performance
- 💰 Receive payments through secure payment gateway
- ⚙️ Full course builder with drag-and-drop functionality

### General Features
- 🌐 Responsive design (mobile, tablet, desktop)
- 🔔 Email notifications for enrollments and payments
- 🎨 Modern dark-themed UI with Tailwind CSS
- 🚀 Fast and scalable backend with Express.js
- 💾 MongoDB database for flexible data storage
- 🖼️ Cloud storage with Cloudinary for media files

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Razorpay** - Payment gateway
- **Cloudinary** - Cloud storage for media

### DevOps & Deployment
- **Netlify** - Frontend deployment
- **MongoDB Atlas** - Cloud database
- **Environment Variables** - Configuration management

---

## 📁 Project Structure

```
SkillBridge/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── common/              # Reusable UI components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ...
│   │   │   └── core/                # Feature-specific components
│   │   │       ├── Dashboard/       # Dashboard pages
│   │   │       ├── Auth/            # Authentication components
│   │   │       └── ...
│   │   ├── pages/                   # Page components
│   │   ├── slices/                  # Redux slices
│   │   │   ├── cartSlice.js         # Shopping cart state
│   │   │   ├── authSlice.js         # Authentication state
│   │   │   ├── courseSlice.js       # Course state
│   │   │   └── ...
│   │   ├── services/                # API calls
│   │   │   ├── operations/          # Complex API operations
│   │   │   │   ├── courseDetailsAPI.js
│   │   │   │   ├── authAPI.js
│   │   │   │   └── ...
│   │   │   └── apiconnector.js      # Axios instance
│   │   ├── utils/                   # Utility functions
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── data/                    # Static data
│   │   │   ├── navbar-links.js
│   │   │   ├── dashboard-links.js
│   │   │   └── footer-links.js
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend Node/Express application
│   ├── config/                      # Configuration files
│   │   ├── database.js              # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── razorpay.js              # Razorpay configuration
│   ├── controllers/                 # Request handlers
│   │   ├── Auth.js                  # Authentication logic
│   │   ├── Course.js                # Course management
│   │   ├── Category.js              # Category management
│   │   ├── Profile.js               # User profile management
│   │   ├── Payments.js              # Payment processing
│   │   └── ...
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Category.js
│   │   ├── CourseProgress.js
│   │   └── ...
│   ├── routes/                      # API routes
│   │   ├── Auth.js
│   │   ├── Course.js
│   │   ├── Profile.js
│   │   ├── Payments.js
│   │   └── ...
│   ├── middlewares/                 # Custom middlewares
│   │   ├── auth.js                  # JWT verification
│   │   └── ...
│   ├── mail/                        # Email templates
│   │   └── templates/
│   │       ├── paymentSuccessEmail.js
│   │       ├── courseEnrollmentEmail.js
│   │       └── passwordUpdate.js
│   ├── utils/                       # Utility functions
│   ├── index.js                     # Entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── public/                          # Static assets
├── .env                             # Root environment variables
├── .gitignore
├── eslint.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Razorpay account

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:4000/api/v1
EOF

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with required variables
cat > .env << EOF
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM_EMAIL=your_email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
EOF

# Start the server
npm start
```

The backend will run on `http://localhost:4000`

---

## ⚙️ Configuration

### Environment Variables

**Frontend (.env.local)**
- `VITE_API_BASE_URL` - Backend API base URL

**Backend (.env)**
- `PORT` - Server port (default: 4000)
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `COOKIE_EXPIRE` - Cookie expiration time
- `CLOUDINARY_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `MAIL_HOST` - SMTP host
- `MAIL_USER` - Email address
- `MAIL_PASS` - Email app password
- `MAIL_FROM_EMAIL` - Sender email
- `FRONTEND_URL` - Frontend application URL

---

## 💻 Usage

### Starting the Application

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### Key Features Walkthrough

#### For Students
1. **Browse Courses** - Navigate to Catalog and explore courses by category
2. **Add to Cart** - Click on course cards to add to shopping cart
3. **Check Out** - Proceed to checkout with Razorpay payment
4. **Access Course** - After payment, access course content from dashboard
5. **Track Progress** - Monitor learning progress and complete assignments

#### For Instructors
1. **Create Course** - Navigate to Dashboard → Create Course
2. **Build Sections** - Add sections and subsections with lectures
3. **Upload Content** - Upload video lectures and course materials
4. **Publish Course** - Publish course for students to enroll
5. **Monitor Sales** - Track enrollments and revenue

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /sendotp` - Send OTP for verification
- `POST /changepassword` - Change password

### Courses (`/api/v1/course`)
- `GET /getAllCourses` - Get all courses
- `GET /getCourseDetails/:id` - Get course details
- `POST /createCourse` - Create new course (Instructor)
- `PUT /editCourse/:id` - Edit course (Instructor)
- `DELETE /deleteCourse/:id` - Delete course (Instructor)
- `POST /createSection` - Add section to course
- `PUT /updateSection/:id` - Update section
- `DELETE /deleteSection/:id` - Delete section
- `POST /addLecture` - Add lecture to section
- `DELETE /deleteLecture/:lectureId` - Delete lecture

### Categories (`/api/v1/course`)
- `GET /showAllCategories` - Get all categories
- `GET /getCategoryPageDetails/:id` - Get category page details

### Payments (`/api/v1/payment`)
- `POST /capturePayment` - Capture payment
- `POST /verifyPayment` - Verify Razorpay payment
- `GET /paymentHistory` - Get payment history

### Profile (`/api/v1/profile`)
- `GET /getUserDetails` - Get user profile
- `PUT /updateProfile` - Update profile
- `POST /changeDisplayPicture` - Update profile picture
- `GET /enrolledCourses` - Get enrolled courses

---

## 📊 Database Models

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: String,
  accountType: String (Student|Instructor|Admin),
  additionalDetails: ObjectId (Profile),
  courses: [ObjectId],
  courseProgress: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Course Schema
```javascript
{
  courseName: String,
  courseDescription: String,
  instructor: ObjectId,
  whatYouWillLearn: [String],
  courseContent: [ObjectId],
  ratingAndReviews: [ObjectId],
  price: Number,
  thumbnail: String,
  tag: [String],
  category: ObjectId,
  studentEnrolled: [ObjectId],
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Section Schema
```javascript
{
  sectionName: String,
  subSection: [ObjectId],
  course: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💳 Payment Integration

SkillBridge uses **Razorpay** for secure payment processing.

### Payment Flow
1. User adds courses to cart
2. User proceeds to checkout
3. Razorpay payment modal is displayed
4. User completes payment
5. Payment is verified on backend
6. Student is enrolled in course
7. Confirmation email is sent

### Testing
Use Razorpay's test credentials:
- Card: `4111111111111111`
- Expiry: Any future date
- CVV: Any 3 digits

---

## 📧 Email Templates

### Payment Success Email
Sent after successful course enrollment payment

### Course Enrollment Email
Sent when student enrolls in a course

### Password Update Email
Sent when user updates their password

All emails are configured in [server/mail/templates/](server/mail/templates/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Sumit** © 2026

Made with ❤️ for education and learning

---

## 🔗 Links

- **Live Demo:** [https://agent-698b7772839f4822a99--candid-hotteok-623f72.netlify.app/](https://agent-698b7772839f4822a99--candid-hotteok-623f72.netlify.app/)
- **GitHub Repository:** [Add your GitHub repo link here]
- **Issues & Feedback:** [GitHub Issues]

---

## 📞 Support

For support, email us at `info@SkillBridge.com` or raise an issue on GitHub.

---

## 🎯 Future Enhancements

- [ ] Live classes functionality
- [ ] Discussion forums
- [ ] Peer-to-peer learning
- [ ] AI-powered course recommendations
- [ ] Mobile app (React Native)
- [ ] Gamification and badges
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---


**Happy Learning! 🚀**

=======
SkillBridge – Online Education Platform (MERN Stack)


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
>>>>>>> 848c15b (Initial commit)
