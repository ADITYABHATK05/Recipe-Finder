import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";

const CUISINE_DETAILS = [
  {
    id: "All",
    label: "All Cuisines",
    sub: "Global Palette",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    id: "Indian",
    label: "Indian",
    sub: "Aromatic Spices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18" />
        <path d="M3 12a9 9 0 0 0 18 0" />
        <path d="M7 8c0-2.5 1-4 1-4s1 1.5 1 4" />
        <path d="M11 8c0-2.5 1-4 1-4s1 1.5 1 4" />
        <path d="M15 8c0-2.5 1-4 1-4s1 1.5 1 4" />
      </svg>
    )
  },
  {
    id: "Italian",
    label: "Italian",
    sub: "Classic Herbs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M9 16c.5-.5 1.5-.5 2 0s1.5.5 2 0" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "Mexican",
    label: "Mexican",
    sub: "Bold & Zesty",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 15 0" />
        <path d="M3 12h18" />
        <path d="M12 21a9 9 0 0 1-9-9" />
        <circle cx="9" cy="8" r="1" fill="currentColor" />
        <circle cx="14" cy="7" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "Asian",
    label: "Asian",
    sub: "Savory & Fresh",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M19 2L10 11" />
        <path d="M3 11c0 4.97 4.03 9 9 9s9-4.03 9-9H3z" />
      </svg>
    )
  },
  {
    id: "Japanese",
    label: "Japanese",
    sub: "Fresh & Delicate",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="8" height="8" rx="2" />
        <circle cx="7" cy="14" r="2" />
        <rect x="13" y="10" width="8" height="8" rx="2" />
        <circle cx="17" cy="14" r="2" />
        <path d="M2 19h20" />
      </svg>
    )
  },
  {
    id: "Chinese",
    label: "Chinese",
    sub: "Sweet & Savory",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16a8 8 0 0 1-8 8 8 8 0 0 1-8-8z" />
        <path d="M12 3v7" />
        <path d="M12 3L9 6" />
        <path d="M12 3l3 3" />
        <path d="M2 10h2" />
        <path d="M20 10h2" />
      </svg>
    )
  },
  {
    id: "French",
    label: "French",
    sub: "Gourmet Pastry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 22V10M12 15h6M6 4h12c0 6-1 11-6 11S6 10 6 4z" />
      </svg>
    )
  },
  {
    id: "Greek",
    label: "Greek",
    sub: "Mediterranean",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v3H4zm2 3h12v11H6zm-2 11h16v2H4z" />
        <line x1="9" y1="7" x2="9" y2="18" />
        <line x1="12" y1="7" x2="12" y2="18" />
        <line x1="15" y1="7" x2="15" y2="18" />
      </svg>
    )
  },
  {
    id: "Spanish",
    label: "Spanish",
    sub: "Saffron & Olive",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="13" rx="8" ry="5" />
        <path d="M4 13H2M22 13h-2" />
        <path d="M8 10V6a2 2 0 0 1 4 0v4" />
      </svg>
    )
  },
  {
    id: "Thai",
    label: "Thai",
    sub: "Sweet & Spicy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11a9 9 0 0 0 18 0H3z" />
        <path d="M8 11V7c0-2 2-3 2-3" />
        <path d="M13 11V5c0-1.5 2-2 2-2" />
      </svg>
    )
  },
  {
    id: "Middle Eastern",
    label: "Middle Eastern",
    sub: "Hummus & Herbs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="20" x2="20" y2="4" />
        <rect x="7" y="11" width="5" height="5" rx="1" transform="rotate(-45 9.5 13.5)" />
        <rect x="12" y="6" width="5" height="5" rx="1" transform="rotate(-45 14.5 8.5)" />
      </svg>
    )
  },
  {
    id: "American",
    label: "American",
    sub: "Burgers & BBQ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11a9 9 0 0 1 18 0H3z" />
        <rect x="2" y="13" width="20" height="2" rx="1" />
        <path d="M4 17a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4H4z" />
      </svg>
    )
  },
  {
    id: "Caribbean",
    label: "Caribbean",
    sub: "Tropical Spice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a8 8 0 0 0-2-7V4l3 1-1 3" />
        <path d="M12 4c-3 0-5 2-6 5 2-1 4 0 6-2 2 2 4 1 6 2-1-3-3-5-6-5z" />
      </svg>
    )
  }
];

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  // Synchronize active cuisine state with URL search param
  useEffect(() => {
    const cuisineParam = searchParams.get("cuisine");
    if (cuisineParam) {
      const matched = CUISINE_DETAILS.find(
        (cui) => cui.id.toLowerCase() === cuisineParam.toLowerCase()
      );
      if (matched) {
        setActiveCuisine(matched.id);
        const firstSixIds = CUISINE_DETAILS.slice(0, 6).map((c) => c.id);
        if (!firstSixIds.includes(matched.id)) {
          setShowAllCuisines(true);
        }
        return;
      }
    }
    setActiveCuisine("All");
  }, [searchParams]);

  const handleCuisineSelect = (cuisineId) => {
    if (cuisineId === "All") {
      searchParams.delete("cuisine");
    } else {
      searchParams.set("cuisine", cuisineId);
    }
    setSearchParams(searchParams);
  };

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
        <div style={{ display: "flex", gap: "16px", width: "100%", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input-field"
              placeholder="Search dishes from around the world..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <select
              className="filter-select-field"
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
              className="filter-select-field"
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

        {/* 4. Cuisine Selection Cards */}
        <div className="cuisine-selector-wrapper">
          <p className="cuisine-selector-title">
            Filter by Cuisine
          </p>
          <div className="cuisine-grid">
            {(showAllCuisines ? CUISINE_DETAILS : CUISINE_DETAILS.slice(0, 6)).map((cui) => (
              <button
                key={cui.id}
                onClick={() => handleCuisineSelect(cui.id)}
                className={`cuisine-card ${activeCuisine === cui.id ? "active" : ""}`}
                type="button"
                style={{ animation: "fade-up 0.3s ease both" }}
              >
                <div className="cuisine-icon-container">
                  {cui.icon}
                </div>
                <div className="cuisine-info">
                  <span className="cuisine-label">{cui.label}</span>
                  <span className="cuisine-sub">{cui.sub}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", marginTop: "18px" }}>
            <button
              onClick={() => setShowAllCuisines(!showAllCuisines)}
              className="btn btn-secondary btn-sm"
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "16px",
                fontWeight: 600,
                fontSize: "0.9rem"
              }}
            >
              {showAllCuisines ? (
                <>
                  <span>Show Less</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </>
              ) : (
                <>
                  <span>See More Cuisines</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </>
              )}
            </button>
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
