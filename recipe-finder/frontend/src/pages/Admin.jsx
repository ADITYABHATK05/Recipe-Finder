import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Admin = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/recipes");
      setRecipes(response.data.recipes ?? response.data);
    } catch (err) {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete recipe.");
    }
  };

  return (
    <div className="container">
      <div className="admin-header">
        <div>
          <div className="eyebrow">Admin Dashboard</div>
          <h1>Manage dishes</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/app/admin/add")}
        >
          + Add New Dish
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          Loading recipes...
        </div>
      )}

      {!loading && error && <div className="empty-state">{error}</div>}

      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state">
          No recipes yet. Click "Add New Dish" to create one.
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Cuisine</th>
                <th>Cook Time</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.cuisine || "Indian"}</td>
                  <td>{recipe.cookTime}</td>
                  <td>
                    <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/app/admin/edit/${recipe._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(recipe._id, recipe.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
