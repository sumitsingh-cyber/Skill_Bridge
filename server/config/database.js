const mongoose = require("mongoose");

let isConnected = false;

exports.connect = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed");
    console.error(error);
  }
};
