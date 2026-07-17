const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "10m" }, // TTL index: MongoDB will automatically delete documents 10 minutes after createdAt
    },
  }
);

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);
