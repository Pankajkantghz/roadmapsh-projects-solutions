import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not request a reset link."); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><Link className="brand" to="/login"><span className="brand-mark">↗</span> snaproute</Link><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Reset your password</h1><p className="muted">Enter the email connected to your account and we’ll send a reset link.</p>{error && <p className="notice error" role="alert">{error}</p>}{sent ? <p className="notice success" role="status">If that account exists, a reset link is on its way. It expires in 10 minutes.</p> : <><label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><button className="primary-button full" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button></>}<p className="auth-footer"><Link to="/login">Back to sign in</Link></p></form></main>;
}
