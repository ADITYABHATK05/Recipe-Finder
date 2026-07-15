const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  addRecipe,
  getRecipes,
  getRecipeById,
  searchRecipes,
  getRecipesByCategory,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

// IMPORTANT: specific routes (search, category) must come BEFORE /:id
// otherwise Express will treat "search" or a category name as an :id param.

router.use(requireAuth);

router.get("/search", searchRecipes);
router.get("/category/:category", getRecipesByCategory);

router.post("/", requireRole("admin"), addRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", requireRole("admin"), updateRecipe);
router.delete("/:id", requireRole("admin"), deleteRecipe);

module.exports = router;
