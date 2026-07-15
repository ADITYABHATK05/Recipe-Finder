const Recipe = require("../models/Recipe");

// @desc    Add a new recipe
// @route   POST /api/recipes
const addRecipe = async (req, res) => {
  try {
    const { name, image, ingredients, steps, cookTime, category, youtubeUrl, cuisine } = req.body;

    // Manual validation (in addition to schema validation)
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Recipe name cannot be empty" });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ message: "Image URL cannot be empty" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: "Category cannot be empty" });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "Ingredients cannot be empty" });
    }
    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ message: "Steps cannot be empty" });
    }

    const recipe = new Recipe({
      name,
      image,
      ingredients,
      steps,
      cookTime,
      category,
      youtubeUrl,
      cuisine,
    });
    await recipe.save();
    res.status(201).json({ message: "Recipe Added Successfully", recipe });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all recipes (supports optional ?sort=name_asc|name_desc|time_asc|time_desc and pagination)
// @route   GET /api/recipes
const getRecipes = async (req, res) => {
  try {
    const { sort, page, limit } = req.query;

    let query = Recipe.find();

    if (sort === "name_asc") query = query.sort({ name: 1 });
    if (sort === "name_desc") query = query.sort({ name: -1 });
    if (sort === "time_asc") query = query.sort({ cookTime: 1 });
    if (sort === "time_desc") query = query.sort({ cookTime: -1 });

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0;

    const total = await Recipe.countDocuments();

    if (limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const recipes = await query.exec();
    res.status(200).json({ total, recipes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search recipes by name (regex, case-insensitive)
// @route   GET /api/recipes/search?name=dosa
const searchRecipes = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Search keyword is required" });
    }
    const recipes = await Recipe.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get recipes by category
// @route   GET /api/recipes/category/:category
const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({
      category: { $regex: `^${category}$`, $options: "i" },
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { name, image, ingredients, steps, cookTime, category, youtubeUrl, cuisine } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Recipe name cannot be empty" });
    }
    if (image !== undefined && !image.trim()) {
      return res.status(400).json({ message: "Image URL cannot be empty" });
    }
    if (category !== undefined && !category.trim()) {
      return res.status(400).json({ message: "Category cannot be empty" });
    }
    if (ingredients !== undefined && (!Array.isArray(ingredients) || ingredients.length === 0)) {
      return res.status(400).json({ message: "Ingredients cannot be empty" });
    }
    if (steps !== undefined && (!Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({ message: "Steps cannot be empty" });
    }

    recipe.name = name ?? recipe.name;
    recipe.image = image ?? recipe.image;
    recipe.ingredients = ingredients ?? recipe.ingredients;
    recipe.steps = steps ?? recipe.steps;
    recipe.cookTime = cookTime ?? recipe.cookTime;
    recipe.category = category ?? recipe.category;
    recipe.youtubeUrl = youtubeUrl ?? recipe.youtubeUrl;
    recipe.cuisine = cuisine ?? recipe.cuisine;

    await recipe.save();
    res.status(200).json({ message: "Recipe Updated Successfully", recipe });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addRecipe,
  getRecipes,
  getRecipeById,
  searchRecipes,
  getRecipesByCategory,
  updateRecipe,
  deleteRecipe,
};
