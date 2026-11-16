import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@quietbattles.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault(); setError("");
    try {
      const result = await apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("qb_admin_token", result.token);
      navigate("/admin");
    } catch (err) { setError(err.message); }
  }
  return <div className="admin-login"><form onSubmit={handleSubmit} className="admin-login-card">
    <p className="eyebrow">QUIET BATTLES™ / MANAGEMENT</p><h1>Admin sign in</h1>
    <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
    {error && <p className="error-text">{error}</p>}
    <button className="button button-dark">SIGN IN</button>
    <a href="/">Back to website</a>
  </form></div>;
}
