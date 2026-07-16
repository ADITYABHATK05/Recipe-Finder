import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/app" className="brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
            <path d="M6 18h12a2 2 0 0 0 2-2v-3a6 6 0 0 0-16 0v3a2 2 0 0 0 2 2z" />
            <path d="M9 18V9a3 3 0 0 1 6 0v9" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Recipe Finder</span>
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
          <NavLink to="/app/profile" className="nav-user-chip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{user?.name || "Admin"}</span>
          </NavLink>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} type="button" style={{ borderRadius: "12px", display: "inline-flex", alignItems: "center" }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
