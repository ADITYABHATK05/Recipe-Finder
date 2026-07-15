import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/app" className="brand">
          Recipe Finder
        </NavLink>
        <div className="nav-links">
          <NavLink to="/app" end className={({ isActive }) => (isActive ? "active" : "")}> 
            Home
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/app/admin" className={({ isActive }) => (isActive ? "active" : "")}> 
              Dashboard
            </NavLink>
          )}
          <NavLink to="/app/profile" className="nav-user-chip" style={{ textDecoration: "none" }}>
            {user?.name || user?.email || "Profile"}
          </NavLink>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
