require("dotenv").config();
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");
const adminRoutes = require("./routes/Admin");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const { seedDefaultAdmin } = require("./utils/seedAdmin");

const PORT = process.env.PORT || 4000;

// Allowed origins — production Vercel frontend + localhost for development
const ALLOWED_ORIGINS = [
  "https://skill-bridge-lemon.vercel.app",
  "https://skill-bridge-sumit-singhs-projects-140ed6ee.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Allow additional origins via env var (comma-separated)
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(",").forEach((o) => {
    const trimmed = o.trim();
    if (trimmed && !ALLOWED_ORIGINS.includes(trimmed)) ALLOWED_ORIGINS.push(trimmed);
  });
}

// Connect DB, then provision admin if not already present
database.connect().then(async () => {
  await seedDefaultAdmin();
  // NOTE: seedDefaultCourses() is intentionally NOT called here.
  //       Sample/demo courses should not be injected automatically.
  //       Use the admin dashboard or a one-time migration script to manage courses.
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  })
);

// Cloudinary
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge backend is running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

// Start server (Render / Railway / local)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
