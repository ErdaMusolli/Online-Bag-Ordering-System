import React, { useEffect, useState } from "react";
import { authFetch } from "../../services/authFetch";
import { jwtDecode } from "jwt-decode";
import { getNewAccessToken } from "../../services/tokenUtils";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5197"; 

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
    const checkToken = async () => {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getNewAccessToken();
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }
      }

      try {
        jwtDecode(token); 
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login", { replace: true });
      }
    };

    checkToken();
  }, [navigate]);


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await authFetch(`${API_BASE}/api/users/me`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setForm({
          username: data.username || "",
          email: data.email || "",
          birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
          gender: data.gender || "",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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

      const res = await authFetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Update failed");
      }

      setSuccess("Saved successfully ✅");
    } catch (err) {
      console.error(err);
      setError(err.message);
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
