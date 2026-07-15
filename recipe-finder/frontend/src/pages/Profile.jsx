import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    age: user?.age || "",
    country: user?.country || "",
    sex: user?.sex || "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.age !== "" && (isNaN(form.age) || Number(form.age) <= 0)) {
      setError("Please enter a valid age.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.put("/auth/profile", {
        fullname: form.fullname.trim(),
        age: form.age === "" ? null : Number(form.age),
        country: form.country.trim(),
        sex: form.sex,
      });

      updateUser(response.data.user);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="form-page glass-card" style={{ maxWidth: "600px", margin: "40px auto", padding: "32px", borderRadius: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #f97316)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "0 auto 12px",
            textTransform: "uppercase",
            boxShadow: "0 8px 24px rgba(193, 68, 14, 0.2)"
          }}>
            {user?.name ? user.name[0] : "U"}
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.8rem" }}>{user?.name || "User Profile"}</h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{user?.email}</p>
          <span className="status-pill status-pill-positive" style={{ marginTop: "12px" }}>
            Role: {user?.role || "customer"}
          </span>
        </div>

        {error && <p className="form-error" style={{ textAlign: "center", marginBottom: "16px" }}>{error}</p>}
        {success && <p style={{ color: "var(--success)", fontSize: "0.9rem", textAlign: "center", marginBottom: "16px", fontWeight: 600 }}>{success}</p>}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-input"
              type="text"
              value={form.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
              disabled={!editing}
              placeholder="e.g. Aditya Bhat"
              required={editing}
              style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "text" : "not-allowed" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Age</label>
              <input
                className="form-input"
                type="number"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
                disabled={!editing}
                placeholder="e.g. 25"
                style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "text" : "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>Sex</label>
              <select
                className="category-select"
                value={form.sex}
                onChange={(e) => handleChange("sex", e.target.value)}
                disabled={!editing}
                style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "pointer" : "not-allowed" }}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              className="form-input"
              type="text"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              disabled={!editing}
              placeholder="e.g. India"
              style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "text" : "not-allowed" }}
            />
          </div>

          <div style={{ marginTop: "30px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            {!editing ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setEditing(true)}
                style={{ width: "100%" }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm({
                      fullname: user?.fullname || "",
                      age: user?.age || "",
                      country: user?.country || "",
                      sex: user?.sex || "",
                    });
                    setEditing(false);
                    setError("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
