import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert", "Beverages"];

const CUISINES_LIST = [
  "Indian",
  "Italian",
  "Mexican",
  "Asian",
  "Japanese",
  "Chinese",
  "French",
  "Greek",
  "Spanish",
  "Thai",
  "Middle Eastern",
  "American",
  "Caribbean"
];

const AddRecipe = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    image: "",
    ingredients: "",
    steps: "",
    cookTime: "",
    category: "",
    cuisine: "",
    youtubeUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Recipe name is required.";
    if (!form.image) newErrors.image = "Recipe image is required.";
    if (!form.category.trim()) newErrors.category = "Category is required.";
    if (!form.cuisine.trim()) newErrors.cuisine = "Cuisine is required.";
    if (!form.ingredients.trim())
      newErrors.ingredients = "At least one ingredient is required.";
    if (!form.steps.trim())
      newErrors.steps = "At least one preparation step is required.";
    if (!form.cookTime.trim()) newErrors.cookTime = "Cook time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post("/recipes", {
        name: form.name.trim(),
        image: form.image,
        cookTime: form.cookTime.trim(),
        category: form.category,
        cuisine: form.cuisine,
        youtubeUrl: form.youtubeUrl.trim(),
        // Split comma or newline separated text into a clean array
        ingredients: form.ingredients
          .split(/\n|,/)
          .map((i) => i.trim())
          .filter(Boolean),
        steps: form.steps
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean),
      });
      navigate("/app/admin");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to add recipe. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-page">
        <h1>Add New Recipe</h1>

        {serverError && <p className="form-error">{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Name</label>
            <input
              className="form-input"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Masala Dosa"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Recipe Image (Upload from device)</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
            {form.image && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "6px" }}>Preview:</p>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            )}
            {errors.image && <p className="form-error">{errors.image}</p>}
          </div>

          <div className="form-group">
            <label>Ingredients (one per line, or comma-separated)</label>
            <textarea
              className="form-textarea"
              value={form.ingredients}
              onChange={(e) => handleChange("ingredients", e.target.value)}
              placeholder={"Rice\nUrad Dal\nPotato"}
            />
            {errors.ingredients && (
              <p className="form-error">{errors.ingredients}</p>
            )}
          </div>

          <div className="form-group">
            <label>Preparation Steps (one per line)</label>
            <textarea
              className="form-textarea"
              value={form.steps}
              onChange={(e) => handleChange("steps", e.target.value)}
              placeholder={"Prepare dosa batter\nBoil potatoes\nCook dosa"}
            />
            {errors.steps && <p className="form-error">{errors.steps}</p>}
          </div>

          <div className="form-group">
            <label>Cook Time</label>
            <input
              className="form-input"
              type="text"
              value={form.cookTime}
              onChange={(e) => handleChange("cookTime", e.target.value)}
              placeholder="e.g. 30 mins"
            />
            {errors.cookTime && <p className="form-error">{errors.cookTime}</p>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="category-select"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">-- Select category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          <div className="form-group">
            <label>Cuisine</label>
            <select
              className="category-select"
              value={form.cuisine}
              onChange={(e) => handleChange("cuisine", e.target.value)}
            >
              <option value="">-- Select cuisine --</option>
              {CUISINES_LIST.map((cui) => (
                <option key={cui} value={cui}>
                  {cui}
                </option>
              ))}
            </select>
            {errors.cuisine && <p className="form-error">{errors.cuisine}</p>}
          </div>

          <div className="form-group">
            <label>YouTube Video URL (Optional)</label>
            <input
              className="form-input"
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/app/admin")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
