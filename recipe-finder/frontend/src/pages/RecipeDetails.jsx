import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const getEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/recipes/${recipe._id}`);
      navigate("/app", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete recipe.");
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Recipe not found."
            : "Failed to load recipe."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

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

  if (error || !recipe) {
    return (
      <div className="container">
        <div className="empty-state">{error || "Recipe not found."}</div>
        <button className="btn btn-secondary" onClick={() => navigate("/app")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="details-hero">
        <img
          src={recipe.image}
          alt={recipe.name}
          onError={(e) => {
            e.target.src = "https://placehold.co/800x400?text=No+Image";
          }}
        />
      </div>

      <div className="details-header">
        <h1>{recipe.name}</h1>
        <div className="recipe-meta">
          <span className="category-tag">{recipe.category}</span>
          <span>{recipe.cookTime}</span>
        </div>
      </div>

      <div className="details-section">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="details-section">
        <h2>Preparation Steps</h2>
        <ol>
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.youtubeUrl && getEmbedUrl(recipe.youtubeUrl) && (
        <div className="details-section">
          <h2>Video Tutorial</h2>
          <div className="video-container" style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "16px", boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
            <iframe
              src={getEmbedUrl(recipe.youtubeUrl)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}

      <div style={{ margin: "30px 0 50px", display: "flex", gap: "12px" }}>
        <button className="btn btn-secondary" onClick={() => navigate("/app")}>
          ← Back to Home
        </button>
        {user?.role === "admin" && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/app/admin/edit/${recipe._id}`)}
            >
              Edit Recipe
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Recipe
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
