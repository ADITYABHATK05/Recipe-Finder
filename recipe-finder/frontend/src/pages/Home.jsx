import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";

const CUISINES = ["All", "Indian", "Italian", "Mexican", "Asian"];

const Home = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let response;

      if (searchTerm.trim()) {
        // Search endpoint takes priority
        response = await api.get("/recipes/search", {
          params: { name: searchTerm.trim() },
        });
        setRecipes(response.data);
      } else if (category !== "All") {
        response = await api.get(`/recipes/category/${category}`);
        setRecipes(response.data);
      } else {
        response = await api.get("/recipes", {
          params: sort ? { sort } : {},
        });
        setRecipes(response.data.recipes ?? response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load recipes. Please try again."
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, sort]);

  // Debounce search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  // Filter by cuisine on frontend
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (activeCuisine === "All") return true;
      return recipe.cuisine?.toLowerCase() === activeCuisine.toLowerCase();
    });
  }, [recipes, activeCuisine]);

  return (
    <div className="container" style={{ animation: "fade-up 0.5s ease both" }}>
      {/* 1. Welcoming Hero Banner */}
      <div className="home-hero glass-card" style={{ padding: "30px", borderRadius: "24px", marginTop: "24px", marginBottom: "32px", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4))", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ letterSpacing: "0.18em" }}>Chef Dashboard</span>
          <h1 style={{ fontSize: "2.4rem", margin: "8px 0", letterSpacing: "-0.02em" }}>
            Welcome back, {user?.name || "Chef"}!
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "1.1rem" }}>
            What delicious dish are we preparing today? Browse curated world cuisines below.
          </p>
        </div>
      </div>

      {/* 2. Featured Recipe Highlights Banner */}
      {!loading && !error && recipes.length > 0 && (
        <div className="featured-banner glass-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderRadius: "20px", overflow: "hidden", marginBottom: "36px", background: "rgba(255,255,255,0.4)" }}>
          <img 
            src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80" 
            alt="Classic Margherita Pizza"
            style={{ width: "100%", height: "260px", objectFit: "cover" }}
          />
          <div style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span className="category-tag" style={{ width: "fit-content", marginBottom: "12px", background: "#fee2e2", color: "#991b1b" }}>Featured Italian Special</span>
            <h2 style={{ margin: "0 0 10px", fontSize: "1.6rem" }}>Classic Margherita Pizza</h2>
            <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: "0.95rem", lineHeight: "1.5" }}>
              Experience the perfect crust topped with freshly crushed tomatoes, thick slices of melted mozzarella, and fresh basil leaves.
            </p>
            <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem", color: "var(--muted)" }}>
              <span>Cook Time: 15 mins</span>
              <span>•</span>
              <span>Dinner</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search and Filters */}
      <div className="filters-section" style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "16px", width: "100%", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              className="search-input"
              style={{ width: "100%", padding: "12px 18px", fontSize: "1rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.7)", border: "1px solid var(--line)" }}
              placeholder="Search dishes from around the world..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <select
              className="category-select"
              style={{ padding: "12px 16px", fontSize: "0.95rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.7)", border: "1px solid var(--line)" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverages">Beverages</option>
            </select>

            <select
              className="category-select"
              style={{ padding: "12px 16px", fontSize: "0.95rem", borderRadius: "16px", background: "rgba(255, 255, 255, 0.7)", border: "1px solid var(--line)" }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort: Default</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="time_asc">Cook Time (shortest first)</option>
              <option value="time_desc">Cook Time (longest first)</option>
            </select>
          </div>
        </div>

        {/* 4. Cuisine Selection Chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 700, margin: 0 }}>
            Filter by Cuisine
          </p>
          <div className="cuisine-selector" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
            {CUISINES.map((cui) => (
              <button
                key={cui}
                onClick={() => setActiveCuisine(cui)}
                className={`btn ${activeCuisine === cui ? "btn-primary" : "btn-secondary"}`}
                style={{
                  borderRadius: "999px",
                  padding: "8px 20px",
                  fontSize: "0.9rem",
                  border: activeCuisine === cui ? "none" : "1px solid var(--line)",
                  background: activeCuisine === cui ? "var(--accent)" : "rgba(255,255,255,0.6)",
                  boxShadow: activeCuisine === cui ? "0 4px 12px rgba(193, 68, 14, 0.2)" : "none"
                }}
              >
                {cui === "All" ? "🌍 All Cuisines" : cui}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && !error && (
        <p className="result-count">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          Loading recipes...
        </div>
      )}

      {!loading && error && <div className="empty-state">{error}</div>}

      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="empty-state">No recipes found. Try a different search, category or cuisine.</div>
      )}

      {!loading && !error && filteredRecipes.length > 0 && (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
