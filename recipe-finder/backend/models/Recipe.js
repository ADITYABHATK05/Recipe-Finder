const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one ingredient is required",
      },
    },
    steps: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one step is required",
      },
    },
    cookTime: {
      type: String,
      required: [true, "Cook time is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snacks",
        "Dessert",
        "Beverages",
      ],
    },
    youtubeUrl: {
      type: String,
      default: "",
      trim: true,
    },
    cuisine: {
      type: String,
      default: "Indian",
      trim: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("Recipe", recipeSchema, "recipes");
