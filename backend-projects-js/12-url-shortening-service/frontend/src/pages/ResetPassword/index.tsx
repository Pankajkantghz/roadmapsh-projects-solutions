import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/slices/authSlice";
import { apiRequest } from "@/lib/api";

export default function ResetPasswordPage() {
  const { token = "" } = useParams(); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false); const navigate = useNavigate(); const dispatch = useDispatch();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await apiRequest(`/auth/reset-password/${encodeURIComponent(token)}`, { method: "POST", body: JSON.stringify({ password }) }); dispatch(logout()); setDone(true); window.setTimeout(() => navigate("/login"), 1800); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not reset your password."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><Link className="brand" to="/login"><span className="brand-mark">↗</span> snaproute</Link><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Choose a new password</h1><p className="muted">Use at least 6 characters for your new password.</p>{error && <p className="notice error" role="alert">{error}</p>}{done ? <p className="notice success" role="status">Password updated. Taking you to sign in…</p> : <><label>New password<input type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary-button full" disabled={busy}>{busy ? "Updating…" : "Update password"}</button></>}<p className="auth-footer"><Link to="/login">Back to sign in</Link></p></form></main>;
}
