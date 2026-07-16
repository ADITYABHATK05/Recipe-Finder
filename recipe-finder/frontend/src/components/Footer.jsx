import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Brand Info */}
          <div className="footer-col">
            <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "1.4rem", fontWeight: 700 }}>
              Recipe Finder
            </h3>
            <p style={{ marginTop: "8px" }}>
              Explore, curate, and master recipes from around the globe. Elevate your culinary journey with step-by-step guidance.
            </p>
            <div className="footer-social-icons" style={{ marginTop: "12px" }}>
              <a href="https://instagram.com" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://twitter.com" className="footer-social-link" target="_blank" rel="noreferrer" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Navigation</h4>
              <ul className="footer-links-list">
                <li><Link to="/app">Home Dashboard</Link></li>
                <li><Link to="/app/profile">My Profile</Link></li>
                {user?.role === "admin" && (
                  <li><Link to="/app/admin">Admin Panel</Link></li>
                )}
              </ul>
            </div>

            {/* Popular Cuisines */}
            <div className="footer-col">
              <h4>Explore Cuisines</h4>
              <ul className="footer-links-list">
                <li><Link to="/app?cuisine=Italian">Italian Specialties</Link></li>
                <li><Link to="/app?cuisine=Indian">Indian Spices</Link></li>
                <li><Link to="/app?cuisine=Mexican">Mexican Tastes</Link></li>
                <li><Link to="/app?cuisine=Japanese">Japanese Sushi</Link></li>
                <li><Link to="/app?cuisine=Chinese">Chinese Wok</Link></li>
                <li><Link to="/app?cuisine=Greek">Greek Mediterranean</Link></li>
                <li><Link to="/app?cuisine=Thai">Thai Sweet & Spicy</Link></li>
                <li><Link to="/app?cuisine=French">French Gourmet</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h4>Contact & Support</h4>
              <p style={{ fontSize: "0.9rem" }}>
                Questions or recipe suggestions? Feel free to reach out to our cooking community support.
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--accent)" }}>
                support@recipefinder.com
              </p>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <p>&copy; {currentYear} Recipe Finder. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
  
