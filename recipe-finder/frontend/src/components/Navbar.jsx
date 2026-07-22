import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search term from URL query parameter
  const searchParam = searchParams.get("search") || "";
  const [navSearch, setNavSearch] = useState(searchParam);

  // Synchronize local search input with URL search param changes
  useEffect(() => {
    setNavSearch(searchParam);
  }, [searchParam]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setNavSearch(val);

    // Update query parameter
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set("search", val);
    } else {
      newParams.delete("search");
    }

    // If they aren't on the Home page, navigate to Home with query params
    if (location.pathname !== "/app") {
      navigate(`/app?${newParams.toString()}`);
    } else {
      setSearchParams(newParams);
    }
  };

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

        <div className="navbar-search" style={{ flex: 1, maxWidth: "450px" }}>
          <div className="search-wrapper" style={{ minWidth: "auto" }}>
            <input
              type="text"
              className="search-input-field"
              style={{
                padding: "10px 16px 10px 42px",
                borderRadius: "12px",
                fontSize: "0.9rem",
                background: "#ffffff",
                border: "2px solid rgba(193, 68, 14, 0.35)",
                boxShadow: "0 2px 8px rgba(193, 68, 14, 0.08)",
                transition: "all 0.2s ease"
              }}
              placeholder="Search dishes from around the world..."
              value={navSearch}
              onChange={handleSearchChange}
            />
            <svg className="search-icon" style={{ left: "14px", width: "16px", height: "16px", color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

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
