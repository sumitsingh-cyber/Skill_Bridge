const mongoose = require("mongoose");

let isConnected = false;

exports.connect = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    console.error("CRITICAL: MONGODB_URL environment variable is not set. Server cannot start.");
    process.exit(1);
  }

  try {
    const db = await mongoose.connect(mongoUrl);
    isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
