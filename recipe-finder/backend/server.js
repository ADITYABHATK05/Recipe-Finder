require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const Recipe = require("./models/Recipe");
const seedRecipes = require("./data/seedRecipes");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Recipe Finder API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const recipeCount = await Recipe.countDocuments();
  if (recipeCount === 0) {
    await Recipe.insertMany(seedRecipes);
    console.log(`Seeded ${seedRecipes.length} sample recipes into Atlas.`);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT before starting another backend instance.`);
      process.exit(1);
    }

    throw error;
  });
};

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
