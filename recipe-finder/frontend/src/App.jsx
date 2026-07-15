import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate, useParams } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import Admin from "./pages/Admin";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Profile from "./pages/Profile";

const LegacyRecipeRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app/recipe/${id}`} replace />;
};

const LegacyAdminEditRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/app/admin/edit/${id}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
        <Route path="/admin/add" element={<Navigate to="/app/admin/add" replace />} />
        <Route path="/admin/edit/:id" element={<LegacyAdminEditRedirect />} />
        <Route path="/recipe/:id" element={<LegacyRecipeRedirect />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="recipe/:id" element={<RecipeDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
            <Route path="admin/add" element={<ProtectedRoute allowedRoles={["admin"]}><AddRecipe /></ProtectedRoute>} />
            <Route path="admin/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><EditRecipe /></ProtectedRoute>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
