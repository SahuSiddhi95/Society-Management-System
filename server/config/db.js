// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    
    // Drop the obsolete unique index if it exists in the database
    try {
      await mongoose.connection.db.collection("transactions").dropIndex("razorpayOrderId_1");
      console.log("Obsolete index 'razorpayOrderId_1' dropped successfully");
    } catch (idxErr) {
      // Ignore if index does not exist
      if (idxErr.codeName !== "IndexNotFound" && idxErr.code !== 27) {
        console.log("Index drop note:", idxErr.message);
      }
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("👉 Please add your MongoDB Atlas URI to MONGO_URI in server/.env file.");
  }
};

module.exports = connectDB;