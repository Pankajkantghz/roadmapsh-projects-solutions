import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/slices/authSlice";
import { apiRequest } from "@/lib/api";

interface AuthResponse { success: boolean; data: { id: string; username: string; email: string; isEmailVerified: boolean; accessToken: string } }

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const result = await apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      dispatch(setCredentials({ token: result.data.accessToken, user: { id: result.data.id, email: result.data.email, name: result.data.username, verified: result.data.isEmailVerified } }));
      navigate("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not sign in."); }
    finally { setBusy(false); }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <Link className="brand" to="/login"><span className="brand-mark">↗</span> snaproute</Link>
    <p className="eyebrow">YOUR LINKS, IN ONE PLACE</p><h1>Welcome back</h1><p className="muted">Sign in to manage your short links and analytics.</p>
    {error && <p className="notice error" role="alert">{error}</p>}
    <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
    <p className="forgot-link"><Link to="/forgot-password">Forgot password?</Link></p>
    <button className="primary-button full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <div className="auth-divider"><span>or continue with</span></div>
    <a className="secondary-button full" href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/v1/auth/google`}>Continue with Google</a>
    <p className="auth-footer">New to SnapRoute? <Link to="/register">Create an account</Link></p>
  </form></main>;
}
