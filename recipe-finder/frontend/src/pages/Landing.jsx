import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const trendingPreview = [
  {
    title: "Classic Margherita Pizza",
    cuisine: "Italian",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80",
    desc: "A thin-crust Italian masterpiece topped with crushed tomatoes, melted mozzarella, and fresh basil leaves.",
    time: "15 mins",
  },
  {
    title: "Tacos al Pastor",
    cuisine: "Mexican",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
    desc: "Savory marinated pork seared with pineapple, cilantro, and red onions on warm hand-pressed corn tortillas.",
    time: "30 mins",
  },
  {
    title: "Pad Thai Noodles",
    cuisine: "Thai / Asian",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80",
    desc: "Classic stir-fried flat rice noodles tossed in sweet-tangy tamarind sauce with egg, crushed peanuts, and lime.",
    time: "25 mins",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1. Landing Header Navbar */}
      <header className="premium-landing-nav">
        <div className="container premium-landing-nav-inner">
          <div className="premium-brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18h12a2 2 0 0 0 2-2v-3a6 6 0 0 0-16 0v3a2 2 0 0 0 2 2z" />
              <path d="M9 18V9a3 3 0 0 1 6 0v9" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Recipe Finder</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/login")} style={{ borderRadius: "12px", padding: "8px 16px" }}>
            Sign In
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="container premium-landing-hero">
        <div className="landing-copy">
          <h1 className="premium-hero-title">
            Discover, Cook, and Share Delicious Dishes.
          </h1>
          <p className="premium-hero-subtext">
            Explore a world of tastes, gather exact ingredient lists, and follow clear preparation guides.
            Sign in now to find your next favorite meal and customize your personal cooking collection.
          </p>
          <div className="landing-actions" style={{ marginTop: "10px" }}>
            <button className="premium-hero-btn" onClick={() => navigate("/login")}>
              Get Started for Free
            </button>
          </div>
        </div>

        <div className="landing-panel">
          <div className="premium-highlight-card glass-card">
            <img 
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&w=800&q=80" 
              alt="Classic Garlic Butter Salmon"
              style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "26px" }}>
              <span className="status-pill status-pill-positive">Today's Highlight</span>
              <h3 style={{ marginTop: "14px", marginBottom: "8px", fontSize: "1.45rem", fontWeight: 800 }}>
                Classic Garlic Butter Salmon
              </h3>
              <p style={{ margin: "0 0 20px", fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.5 }}>
                A gourmet meal ready in just 20 minutes. Learn to cook tender salmon fillets
                seared to perfection with garlic, lemon juice, and a selection of fresh garden herbs.
              </p>
              <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
                <span>Cook Time: 20 mins</span>
                <span>•</span>
                <span>Dinner Choice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="premium-steps-section">
        <div className="container">
          <div className="premium-section-header">
            <span className="eyebrow">Simplify Cooking</span>
            <h2>How Recipe Finder Works</h2>
            <p>Three simple steps to transition from shopping to serving your next masterpiece.</p>
          </div>

          <div className="landing-steps-grid">
            <div className="premium-step-card">
              <span className="premium-step-watermark">01</span>
              <div className="premium-step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>1. Find Cuisines</h3>
              <p>Explore world cuisines including Italian, Indian, Mexican, Asian, Japanese, and more through our smart global tags.</p>
            </div>

            <div className="premium-step-card">
              <span className="premium-step-watermark">02</span>
              <div className="premium-step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>2. Check Ingredients</h3>
              <p>Review ingredients, prep times, and categories at a glance. Gather exact lists beforehand to cook efficiently.</p>
            </div>

            <div className="premium-step-card">
              <span className="premium-step-watermark">03</span>
              <div className="premium-step-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3>3. Follow Steps</h3>
              <p>Cook with ease using clear, sequential preparation steps, custom visual highlights, and guided video tutorials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Recipes Preview */}
      <section className="premium-recipes-section container">
        <div className="premium-section-header">
          <span className="eyebrow">On the Menu</span>
          <h2>Explore Trending Recipes</h2>
          <p>Take a sneak peek at what other home cooks are preparing this week.</p>
        </div>

        <div className="premium-recipe-grid">
          {trendingPreview.map((item) => (
            <div key={item.title} className="premium-recipe-card" onClick={() => navigate("/login")}>
              <div className="premium-recipe-image-container">
                <img src={item.image} alt={item.title} />
                <span className="premium-recipe-badge">
                  {item.cuisine}
                </span>
              </div>
              <div className="premium-recipe-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="premium-recipe-footer">
                  <span>Cook Time: {item.time}</span>
                  <span className="premium-recipe-link">
                    <span>View Recipe</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="premium-stats-section container">
        <div className="premium-stats-glass">
          <div className="premium-stats-grid">
            <div className="premium-stat-column">
              <span className="premium-stat-number">12+</span>
              <span className="premium-stat-label">World Cuisines</span>
            </div>
            <div className="premium-stat-column">
              <span className="premium-stat-number">1.2k+</span>
              <span className="premium-stat-label">Curated Recipes</span>
            </div>
            <div className="premium-stat-column">
              <span className="premium-stat-number">99%</span>
              <span className="premium-stat-label">Cook Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
};

export default Landing;