const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("✅ Database Connected Successfully...");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDb;