import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/slices/authSlice";
import { apiRequest } from "@/lib/api";

interface AuthResponse { data: { id: string; username: string; email: string; isEmailVerified: boolean; accessToken: string } }

export default function RegisterPage() {
  const [username, setUsername] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const dispatch = useDispatch(); const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const result = await apiRequest<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ username, email, password }) });
      dispatch(setCredentials({ token: result.data.accessToken, user: { id: result.data.id, email: result.data.email, name: result.data.username, verified: result.data.isEmailVerified } }));
      navigate("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create your account."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <Link className="brand" to="/register"><span className="brand-mark">↗</span> snaproute</Link>
    <p className="eyebrow">A BETTER WAY TO SHARE</p><h1>Create your account</h1><p className="muted">Shorten, organize, and understand every link.</p>
    {error && <p className="notice error" role="alert">{error}</p>}
    <label>Name<input autoComplete="name" required minLength={3} maxLength={30} value={username} onChange={e => setUsername(e.target.value)} /></label>
    <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></label>
    <button className="primary-button full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
    <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
  </form></main>;
}
