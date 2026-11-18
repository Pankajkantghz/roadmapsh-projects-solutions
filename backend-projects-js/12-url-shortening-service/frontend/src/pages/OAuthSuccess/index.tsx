import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/features/auth/slices/authSlice";

export default function OAuthSuccessPage() {
  const dispatch = useDispatch(); const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token"); const id = params.get("id"); const email = params.get("email"); const username = params.get("username"); const verified = params.get("verified") === "true";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    if (!token || !id || !email || !username) { navigate("/login", { replace: true }); return; }
    dispatch(setCredentials({ token, user: { id, email, name: username, verified } }));
    navigate("/dashboard", { replace: true });
  }, [dispatch, navigate]);
  return <main className="auth-page"><div className="auth-card"><p className="eyebrow">SECURE SIGN IN</p><h1>Finishing sign in…</h1><p className="muted">We’re opening your SnapRoute workspace.</p></div></main>;
}
