import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/app/recipe/${recipe._id}`)}
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/300x200?text=No+Image";
        }}
      />
      <div className="recipe-card-body">
        <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>{recipe.name}</h3>
        <div className="recipe-meta" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
            <span className="category-tag" style={{ background: "#fdece1", color: "var(--accent-dark)" }}>{recipe.category}</span>
            {recipe.cuisine && (
              <span className="category-tag" style={{ background: "#e0f2fe", color: "#0369a1" }}>{recipe.cuisine}</span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted)", marginTop: "4px" }}>
            <span>Cook Time: {recipe.cookTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
