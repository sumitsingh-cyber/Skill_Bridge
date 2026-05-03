const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

exports.connect = async (retryCount = 0) => {
  const url = process.env.MONGODB_URL;

  if (!url) {
    console.error(
      "[DB] ERROR: MONGODB_URL is not defined in environment variables."
    );
    console.error(
      "[DB] Set MONGODB_URL in your .env file (local) or hosting dashboard (production)."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 10000, // 10s timeout per attempt
    });
    console.log("[DB] Connected successfully to MongoDB Atlas ✅");
  } catch (error) {
    console.error(`[DB] Connection attempt ${retryCount + 1} failed:`, error.message);

    if (retryCount < MAX_RETRIES) {
      console.log(
        `[DB] Retrying in ${RETRY_DELAY_MS / 1000}s... (${retryCount + 1}/${MAX_RETRIES})`
      );
      setTimeout(() => exports.connect(retryCount + 1), RETRY_DELAY_MS);
    } else {
      console.error("[DB] Max retries reached. Server shutting down.");
      console.error(
        "[DB] FIX: Check your MONGODB_URL and ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access."
      );
      process.exit(1);
    }
  }
};
