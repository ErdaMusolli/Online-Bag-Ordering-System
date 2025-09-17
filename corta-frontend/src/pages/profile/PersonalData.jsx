import React, { useEffect, useState } from "react";
import api from "../../services/apiClient";  
import { useNavigate } from "react-router-dom";

const PersonalData = () => {
  const [form, setForm] = useState({
   username: "",
    email: "",
    birthDate: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/users/me"); 
        if (cancelled) return;

        const rawBirth = data.birthDate ?? data.BirthDate ?? "";
        const birthDate =
          typeof rawBirth === "string"
            ? rawBirth.includes("T")
              ? rawBirth.split("T")[0]
              : rawBirth
            : "";

        setForm({
          username: data.username ?? data.Username ?? "",
          email: data.email ?? data.Email ?? "",
          birthDate,
          gender: data.gender ?? data.Gender ?? "",
        });
      } catch (err) {
        if (cancelled) return;
        const msg = err?.response?.data || err.message || "Could not load profile";
        setError(typeof msg === "string" ? msg : "Could not load profile");
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
      username: form.username,
      email: form.email,
      birthDate: form.birthDate ? form.birthDate : null,
      gender: form.gender ? form.gender : null
    };

      await api.put("/users/me", payload); 
      setSuccess("Saved successfully ✅");
    } catch (err) {
      const msg = err?.response?.data || err.message || "Update failed";
      setError(typeof msg === "string" ? msg : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "68vw",
        minHeight: "100vh",
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#f8f9fa",
      }}
    >
    
    <div className="card p-4">
      <h4 className="mb-4">Your Personal Data</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Username *</label>
            <input
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Birth of date</label>
            <input
              name="birthDate"
              type="date"
              className="form-control"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="genderMale"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="genderMale">
                Male
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id="genderFemale"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="genderFemale">
                Female
              </label>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="text-end">
          <button type="submit" className="btn btn-warning" disabled={saving}>
            {saving ? "Saving..." : "SAVE"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default PersonalData;
