import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const highlights = [
  {
    title: "Browse Curated Recipes",
    text: "Find detailed lists of ingredients, prep times, and categories for all your favorite dishes.",
  },
  {
    title: "Step-by-Step Cooking",
    text: "Follow clear, sequential instructions that guide you through every stage of preparation.",
  },
  {
    title: "Manage Your Menu",
    text: "Easily add your custom recipes or update existing ones from a unified dashboard.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/app/admin" : "/app", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="landing-page">
      <div className="landing-hero container">
        <div className="landing-copy">
          <div className="eyebrow">Recipe Finder</div>
          <h1>Discover, Cook, and Share Delicious Dishes.</h1>
          <p>
            Explore a world of tastes, gather exact ingredient lists, and follow clear preparation guides.
            Sign in now to find your next favorite meal and customize your personal cooking collection.
          </p>
          <div className="landing-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
              Get Started
            </button>
            <span className="landing-note">Sign in to access our interactive menu.</span>
          </div>
        </div>

        <div className="landing-panel">
          <div className="landing-panel-card glass-card" style={{ padding: "0", overflow: "hidden" }}>
            <img 
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80" 
              alt="Classic Garlic Butter Salmon"
              style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "24px" }}>
              <span className="status-pill status-pill-positive">Today's Highlight</span>
              <h2 style={{ marginTop: "12px", marginBottom: "8px" }}>Classic Garlic Butter Salmon</h2>
              <p style={{ margin: "0 0 16px", fontSize: "0.95rem" }}>
                A gourmet meal ready in just 20 minutes. Learn to cook tender salmon fillets
                seared to perfection with garlic, lemon juice, and a selection of fresh garden herbs.
              </p>
              <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", color: "var(--muted)" }}>
                <span>Cook Time: 20 mins</span>
                <span>•</span>
                <span>Dinner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container landing-grid">
        {highlights.map((item) => (
          <article className="feature-card glass-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Landing;