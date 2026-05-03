// Load environment variables FIRST — before any other imports
require("dotenv").config();

const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// Connect DB (with retry logic)
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS — works for both localhost dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",   // Vite local dev
  "http://localhost:4173",   // Vite local preview
  "http://localhost:5175",   // Vite fallback port
];

// Add production frontend URL if set (set this in Render dashboard)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Health check — useful for Render uptime checks
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge backend is running ✅",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge API is live 🚀",
  });
});

// Always listen — required for Render and all hosting platforms
app.listen(PORT, () => {
  console.log(`[Server] Running on PORT ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);
});
