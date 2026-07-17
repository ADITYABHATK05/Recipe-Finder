import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const Profile = () => {
  const { user, updateUser, logout } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is permanent and will completely remove your data."
    );
    if (!confirmed) return;

    try {
      await api.delete("/auth/delete-account");
      logout();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
    }
  };

  const getInitialDob = (age) => {
    if (!age) return "";
    const year = new Date().getFullYear() - Number(age);
    return `${year}-01-01`;
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "";
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge < 0 ? 0 : calculatedAge;
  };

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    age: user?.age || "",
    country: user?.country || "",
    sex: user?.sex || "",
  });
  const [dob, setDob] = useState(getInitialDob(user?.age));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.picture || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDobChange = (value) => {
    setDob(value);
    const calculatedAge = calculateAge(value);
    handleChange("age", calculatedAge);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.age !== "" && (isNaN(form.age) || Number(form.age) < 0)) {
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
        picture: previewImage,
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
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 12px",
                display: "block",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                border: "2px solid var(--accent)"
              }}
            />
          ) : (
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
          )}
          
          {editing && (
            <div style={{ marginTop: "8px", marginBottom: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
              <label style={{
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: "0.82rem",
                fontWeight: 700,
                background: "rgba(193, 68, 14, 0.06)",
                border: "1px dashed rgba(193, 68, 14, 0.3)",
                padding: "6px 14px",
                borderRadius: "8px",
                display: "inline-block"
              }}>
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              {previewImage && (
                <button
                  type="button"
                  onClick={() => setPreviewImage("")}
                  style={{
                    cursor: "pointer",
                    color: "#dc2626",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    background: "rgba(220, 38, 38, 0.06)",
                    border: "1px dashed rgba(220, 38, 38, 0.3)",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    display: "inline-block"
                  }}
                >
                  Remove Photo
                </button>
              )}
            </div>
          )}

          <h1 style={{ margin: "0 0 4px", fontSize: "1.8rem" }}>{user?.name || "User Profile"}</h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{user?.email}</p>
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
              placeholder=""
              required={editing}
              style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "text" : "not-allowed" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                className="form-input"
                type="date"
                value={dob}
                onChange={(e) => handleDobChange(e.target.value)}
                disabled={!editing}
                max={new Date().toISOString().split("T")[0]}
                style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "pointer" : "not-allowed" }}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Age</label>
              <input
                className="form-input"
                type="text"
                value={form.age}
                disabled
                placeholder=""
                style={{ background: "#fafafa", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                className="category-select"
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={!editing}
                style={{ background: editing ? "var(--surface)" : "#fafafa", cursor: editing ? "pointer" : "not-allowed" }}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((cty) => (
                  <option key={cty} value={cty}>
                    {cty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {!editing ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                  style={{ width: "100%" }}
                >
                  Edit Profile
                </button>
                {user?.role !== "admin" && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDeleteAccount}
                    style={{ 
                      width: "100%", 
                      background: "rgba(220, 38, 38, 0.08)", 
                      color: "#dc2626", 
                      border: "1px solid rgba(220, 38, 38, 0.15)",
                      padding: "12px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 700
                    }}
                  >
                    Delete Account
                  </button>
                )}
              </>
            ) : (
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%" }}>
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
                    setDob(getInitialDob(user?.age));
                    setPreviewImage(user?.picture || "");
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
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
