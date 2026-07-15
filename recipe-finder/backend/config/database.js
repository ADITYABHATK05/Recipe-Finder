const dns = require("dns");
const mongoose = require("mongoose");

if (process.env.MONGO_URI?.startsWith("mongodb+srv://")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const connectDB = async () => {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB Connection Error (attempt ${attempt}/${maxAttempts}): ${error.message}`);

      if (attempt === maxAttempts) {
        throw new Error(
          "Unable to connect to MongoDB Atlas. Check your MONGO_URI, Atlas IP access list, and local DNS/network access."
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

module.exports = connectDB;
