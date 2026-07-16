import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loginWithEmail, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginWithEmail(form);
      navigate("/app", { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="eyebrow">Welcome back</div>
          <h1>Sign in to continue</h1>
          <p>Use your email or Google account. Your role decides what you can access.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Create or enter your password"
              required
            />
          </label>

          {error && <p className="form-error auth-error">{error}</p>}

          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue with email"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        {googleClientId ? (
          <div className="google-wrap">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const user = await loginWithGoogle(credentialResponse.credential);
                  navigate("/app", { replace: true });
                } catch (googleError) {
                  setError(googleError.response?.data?.message || "Google sign-in failed.");
                }
              }}
              onError={() => setError("Google sign-in failed.")}
              useOneTap={false}
            />
          </div>
        ) : (
          <p className="auth-helper">
            Google OAuth is not configured yet. Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable it.
          </p>
        )}

        <button className="btn btn-secondary auth-back" type="button" onClick={() => navigate("/") }>
          Back to landing
        </button>
      </div>
    </div>
  );
};

export default Login;