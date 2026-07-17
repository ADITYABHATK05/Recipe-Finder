import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithEmail, loginWithGoogle, verifyOtp } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await loginWithEmail(form);
      if (result && result.otpSent) {
        setOtpEmail(result.email);
        setShowOtpScreen(true);
      } else {
        navigate("/app", { replace: true });
      }
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setVerifying(true);

    try {
      await verifyOtp(otpEmail, otp.trim());
      navigate("/app", { replace: true });
    } catch (verifyError) {
      setError(verifyError.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await loginWithEmail(form);
      setSuccess("A new verification code has been sent to your email.");
    } catch (resendError) {
      setError(resendError.response?.data?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (showOtpScreen) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="eyebrow">Verification Required</div>
            <h1>Enter security code</h1>
            <p>We've sent a 6-digit OTP code to <strong>{otpEmail}</strong> to verify your email. Please enter it below.</p>
          </div>

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <label>
              One-Time Password (OTP)
              <input
                className="form-input"
                type="text"
                maxLength="6"
                pattern="\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                required
                style={{ textAlign: "center", fontSize: "1.8rem", letterSpacing: "0.2em", fontWeight: 700 }}
              />
            </label>

            {error && <p className="form-error auth-error" style={{ margin: "12px 0 0" }}>{error}</p>}
            {success && <p style={{ color: "var(--success)", fontSize: "0.9rem", textAlign: "center", margin: "12px 0 0", fontWeight: 600 }}>{success}</p>}

            <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={verifying} style={{ marginTop: "24px" }}>
              {verifying ? "Verifying..." : "Verify & Sign Up"}
            </button>
          </form>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", width: "100%" }}>
            <button className="btn btn-secondary" type="button" onClick={handleResendOtp} disabled={loading} style={{ flex: 1, padding: "10px", borderRadius: "12px" }}>
              {loading ? "Sending..." : "Resend Code"}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => { setShowOtpScreen(false); setOtp(""); setError(""); setSuccess(""); }} style={{ flex: 1, padding: "10px", borderRadius: "12px" }}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  await loginWithGoogle(credentialResponse.credential);
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