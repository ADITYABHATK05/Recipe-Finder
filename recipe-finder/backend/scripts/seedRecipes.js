require("dotenv").config();
const connectDB = require("../config/database");
const Recipe = require("../models/Recipe");
const seedRecipes = require("../data/seedRecipes");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing recipes to perform a fresh international seed...");
  await Recipe.deleteMany({});

  await Recipe.insertMany(seedRecipes);
  console.log(`Successfully seeded ${seedRecipes.length} international recipes into Atlas.`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});