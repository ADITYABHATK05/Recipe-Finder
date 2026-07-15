const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default: "",
    },
    authProviders: {
      type: [String],
      default: ["local"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    fullname: {
      type: String,
      default: "",
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    country: {
      type: String,
      default: "",
      trim: true,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);