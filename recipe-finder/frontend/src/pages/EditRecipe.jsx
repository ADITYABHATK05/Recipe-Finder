import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    image: "",
    cookTime: "",
    category: "",
    cuisine: "",
    youtubeUrl: "",
  });
  const [ingredients, setIngredients] = useState(["", ""]);
  const [steps, setSteps] = useState(["", ""]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/recipes/${id}`);
        const r = response.data;
        setForm({
          name: r.name,
          image: r.image,
          cookTime: r.cookTime,
          category: r.category,
          cuisine: r.cuisine || "",
          youtubeUrl: r.youtubeUrl || "",
        });
        
        const loadedIngredients = [...(r.ingredients || [])];
        while (loadedIngredients.length < 2) loadedIngredients.push("");
        setIngredients(loadedIngredients);

        const loadedSteps = [...(r.steps || [])];
        while (loadedSteps.length < 2) loadedSteps.push("");
        setSteps(loadedSteps);
      } catch (err) {
        setServerError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Recipe name is required.";
    if (!form.image) newErrors.image = "Recipe image is required.";
    if (!form.category.trim()) newErrors.category = "Category is required.";
    if (!form.cuisine.trim()) newErrors.cuisine = "Cuisine is required.";
    
    const filteredIngredients = ingredients.map(i => i.trim()).filter(Boolean);
    if (filteredIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required.";
    }
    
    const filteredSteps = steps.map(s => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      newErrors.steps = "At least one step is required.";
    }
    
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
      await api.put(`/recipes/${id}`, {
        name: form.name.trim(),
        image: form.image,
        cookTime: form.cookTime.trim(),
        category: form.category,
        cuisine: form.cuisine,
        youtubeUrl: form.youtubeUrl.trim(),
        ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
        steps: steps.map((s) => s.trim()).filter(Boolean),
      });
      navigate("/app/admin");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update recipe. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner" />
          Loading recipe...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-page" style={{ maxWidth: "700px" }}>
        <h1 style={{ marginBottom: "24px" }}>Edit Recipe</h1>

        {serverError && <p className="form-error" style={{ marginBottom: "20px" }}>{serverError}</p>}

        <form onSubmit={handleSubmit}>
          {/* Section 1: General Info */}
          <div className="form-section-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              General Information
            </h3>

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

            <div className="form-grid-2col">
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
            </div>

            <div className="form-grid-2col">
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
            </div>
          </div>

          {/* Section 2: Recipe Cover Image */}
          <div className="form-section-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Cover Image
            </h3>

            <div className="form-group" style={{ margin: 0 }}>
              <input
                id="file-upload-edit"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ display: "none" }}
              />
              {form.image ? (
                <div className="uploaded-preview-container">
                  <img src={form.image} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => handleChange("image", "")}
                    title="Remove image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload-edit" className="image-upload-zone">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="upload-text">Upload Cover Image</span>
                  <span className="upload-subtext">PNG, JPG, or WEBP up to 10MB</span>
                </label>
              )}
              {errors.image && <p className="form-error" style={{ marginTop: "6px" }}>{errors.image}</p>}
            </div>
          </div>

          {/* Section 3: Ingredients list */}
          <div className="form-section-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                <path d="M12 2c3.038 0 5.5 2.462 5.5 5.5a5.5 5.5 0 0 1-3.5 5.09v6.91a2.5 2.5 0 0 1-5 0v-6.91A5.5 5.5 0 0 1 6.5 7.5C6.5 4.462 8.962 2 12 2z"></path>
              </svg>
              Ingredients
            </h3>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ingredients.map((ing, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div className="ingredient-input-dot"></div>
                    <input
                      className="form-input"
                      type="text"
                      value={ing}
                      onChange={(e) => {
                        const next = [...ingredients];
                        next[idx] = e.target.value;
                        setIngredients(next);
                      }}
                      placeholder={`Ingredient ${idx + 1}`}
                      style={{ flex: 1 }}
                    />
                    {ingredients.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const next = ingredients.filter((_, i) => i !== idx);
                          setIngredients(next);
                        }}
                        style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--line)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIngredients([...ingredients, ""])}
                style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "12px" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add one more ingredient
              </button>
              {errors.ingredients && (
                <p className="form-error" style={{ marginTop: "8px" }}>{errors.ingredients}</p>
              )}
            </div>
          </div>

          {/* Section 4: Preparation Timeline */}
          <div className="form-section-card">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 14 14"></polyline>
              </svg>
              Preparation Steps
            </h3>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {steps.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div className="step-input-badge">{idx + 1}</div>
                    <textarea
                      className="form-input"
                      value={step}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx] = e.target.value;
                        setSteps(next);
                      }}
                      placeholder={`Describe step ${idx + 1}`}
                      style={{ flex: 1, resize: "vertical", minHeight: "45px" }}
                    />
                    {steps.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const next = steps.filter((_, i) => i !== idx);
                          setSteps(next);
                        }}
                        style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--line)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSteps([...steps, ""])}
                style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "12px" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add one more step
              </button>
              {errors.steps && (
                <p className="form-error" style={{ marginTop: "8px" }}>{errors.steps}</p>
              )}
            </div>
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
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
