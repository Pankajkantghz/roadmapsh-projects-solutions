import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { logout, setCredentials } from "@/features/auth/slices/authSlice";
import { apiRequest, SHORT_URL_BASE, type ShortUrl } from "@/lib/api";

interface UrlListResponse { data: { links: ShortUrl[]; pagination: { total: number; page: number; pages: number } } }
interface CreateResponse { data: ShortUrl & { shortUrl: string; qrCode: string } }
interface CurrentUserResponse { data: { id: string; username: string; email: string; isEmailVerified: boolean } }

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [urls, setUrls] = useState<ShortUrl[]>([]); const [search, setSearch] = useState(""); const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState(""); const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState(""); const [tags, setTags] = useState(""); const [expiresAt, setExpiresAt] = useState(""); const [archived, setArchivedView] = useState(false); const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); const [verificationMessage, setVerificationMessage] = useState(""); const [verificationBusy, setVerificationBusy] = useState(false);
  const dispatch = useDispatch(); const navigate = useNavigate();
  const loadUrls = useCallback(async () => {
    try { const result = await apiRequest<UrlListResponse>(`/urls?search=${encodeURIComponent(search)}&archived=${archived}&limit=100`); setUrls(result.data.links); setError(""); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load links."); }
  }, [search, archived]);
  useEffect(() => {
    let current = true;
    apiRequest<UrlListResponse>(`/urls?search=${encodeURIComponent(search)}&archived=${archived}&limit=100`)
      .then(result => { if (current) { setUrls(result.data.links); setError(""); } })
      .catch(err => { if (current) setError(err instanceof Error ? err.message : "Could not load links."); });
    return () => { current = false; };
  }, [search, archived]);
  useEffect(() => {
    if (user || !localStorage.getItem("token")) return;
    let current = true;
    apiRequest<CurrentUserResponse>("/auth/me")
      .then(result => {
        const token = localStorage.getItem("token");
        if (current && token) dispatch(setCredentials({ token, user: { id: result.data.id, name: result.data.username, email: result.data.email, verified: result.data.isEmailVerified } }));
      })
      .catch(() => { if (current) { dispatch(logout()); navigate("/login", { replace: true }); } });
    return () => { current = false; };
  }, [dispatch, navigate, user]);

  async function createUrl(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const result = await apiRequest<CreateResponse>("/urls", { method: "POST", body: JSON.stringify({ originalUrl, ...(customAlias.trim() ? { customAlias: customAlias.trim() } : {}), ...(password ? { password } : {}), ...(tags.trim() ? { tags: tags.split(",").map(tag => tag.trim()).filter(Boolean) } : {}), ...(expiresAt ? { expiresAt: new Date(expiresAt).toISOString() } : {}) }) });
      setOriginalUrl(""); setCustomAlias(""); setPassword(""); setTags(""); setExpiresAt(""); setQrCode(result.data.qrCode); setNotice(`Link ready: ${result.data.shortUrl}`); await loadUrls();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not shorten this link."); }
    finally { setBusy(false); }
  }
  async function removeUrl(id: string) {
    if (!window.confirm("Permanently delete this short link?")) return;
    try { await apiRequest(`/urls/${id}`, { method: "DELETE" }); await loadUrls(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not delete this link."); }
  }
  async function setFavorite(url: ShortUrl) {
    const id = url._id || url.id; if (!id) return;
    try { await apiRequest(`/urls/${id}`, { method: "PATCH", body: JSON.stringify({ isFavorite: !url.isFavorite }) }); await loadUrls(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update this link."); }
  }
  async function setLinkArchived(url: ShortUrl) {
    const id = url._id || url.id; if (!id) return;
    try { await apiRequest(`/urls/${id}/archive`, { method: "PATCH", body: JSON.stringify({ isArchived: !archived }) }); await loadUrls(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update this link."); }
  }
  async function verifyEmail(event: FormEvent) {
    event.preventDefault(); setVerificationBusy(true); setVerificationMessage("");
    try {
      await apiRequest("/auth/verify-email", { method: "POST", body: JSON.stringify({ otp: verificationCode }) });
      if (user) dispatch(setCredentials({ token: localStorage.getItem("token") || "", user: { ...user, verified: true } }));
      setVerificationMessage("Your email is verified."); setVerificationCode("");
    } catch (err) { setVerificationMessage(err instanceof Error ? err.message : "Could not verify your email."); }
    finally { setVerificationBusy(false); }
  }
  async function resendVerification() {
    setVerificationMessage("");
    try { const result = await apiRequest<{ message: string }>("/auth/resend-verification", { method: "POST" }); setVerificationMessage(result.message || "A new code has been sent."); }
    catch (err) { setVerificationMessage(err instanceof Error ? err.message : "Could not send a new code."); }
  }
  async function copy(code: string) {
    const address = `${SHORT_URL_BASE}/${code}`;
    try { await navigator.clipboard.writeText(address); setNotice("Short link copied to clipboard."); }
    catch { setNotice(address); }
  }
  async function signOut() {
    try { await apiRequest("/auth/logout", { method: "POST" }); } catch { /* The local session can still be cleared if the server is offline. */ }
    dispatch(logout()); navigate("/login");
  }
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

  return <div className="app-shell">
    <aside className="sidebar"><Link to="/dashboard" className="brand"><span className="brand-mark">↗</span> snaproute</Link><p className="nav-label">WORKSPACE</p>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>▦</span> Overview</NavLink>
      <NavLink to="/urls" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>↗</span> My links</NavLink>
      <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><span>▥</span> Analytics</NavLink>
      <div className="sidebar-bottom"><div className="avatar">{(user?.name || user?.email || "S").slice(0, 1).toUpperCase()}</div><div className="profile"><strong>{user?.name || "SnapRoute user"}</strong><span>{user?.email || "Your workspace"}</span></div><button className="icon-button" title="Sign out" onClick={signOut}>↪</button></div>
    </aside>
    <main className="main-content"><header className="topbar"><div><p className="eyebrow">WORKSPACE / OVERVIEW</p><h1>Good links start here.</h1></div><span className="status-pill"><i /> All systems operational</span></header>
      {error && <p className="notice error" role="alert">{error}</p>}{notice && <p className="notice success" role="status">{notice}</p>}{qrCode && <div className="qr-result"><img src={qrCode} alt="QR code for your new short link" /><span>Scan this code to open the new short link.</span><button className="icon-button" onClick={() => setQrCode("")} aria-label="Dismiss QR code">×</button></div>}
      {user?.verified === false && <section className="verify-banner"><div><strong>Verify your email</strong><span>Enter the six-digit code we sent to {user.email}.</span>{verificationMessage && <small role="status">{verificationMessage}</small>}</div><form onSubmit={verifyEmail}><input aria-label="Email verification code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} required /><button className="primary-button" disabled={verificationBusy}>{verificationBusy ? "Verifying…" : "Verify"}</button><button type="button" className="text-button" onClick={() => void resendVerification()}>Resend code</button></form></section>}
      <section className="stats-grid"><article className="stat-card"><span className="stat-icon violet">↗</span><p>Total links</p><strong>{urls.length}</strong><small>in your workspace</small></article><article className="stat-card"><span className="stat-icon green">⌁</span><p>Total clicks</p><strong>{totalClicks.toLocaleString()}</strong><small>across active links</small></article><article className="stat-card"><span className="stat-icon amber">★</span><p>Favorites</p><strong>{urls.filter(url => url.isFavorite).length}</strong><small>pinned for quick access</small></article></section>
      <section className="panel create-panel"><div className="section-heading"><div><p className="eyebrow">LINK BUILDER</p><h2>Shorten a URL</h2></div><span className="sparkle">✦</span></div><form onSubmit={createUrl} className="create-form"><label className="field-label" htmlFor="original-url">Destination URL</label><div className="input-row"><span className="input-prefix">↗</span><input id="original-url" type="url" placeholder="https://example.com/your-long-link" value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} required /><button className="primary-button" disabled={busy}>{busy ? "Creating…" : "Shorten link  →"}</button></div><details className="advanced"><summary>Customize your link</summary><label className="field-label" htmlFor="alias">Custom alias <span className="muted">(optional)</span></label><div className="alias-input"><span>{SHORT_URL_BASE.replace(/^https?:\/\//, "")}/</span><input id="alias" placeholder="my-link" value={customAlias} onChange={e => setCustomAlias(e.target.value)} minLength={3} maxLength={30} pattern="[a-zA-Z0-9_-]+" /></div><div className="options-grid"><label className="field-label" htmlFor="tags">Tags <span className="muted">(comma separated)</span><input id="tags" className="option-input" placeholder="work, campaign" value={tags} onChange={e => setTags(e.target.value)} /></label><label className="field-label" htmlFor="expires">Expires on <span className="muted">(optional)</span><input id="expires" className="option-input" type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} /></label><label className="field-label" htmlFor="link-password">Password protect <span className="muted">(optional)</span><input id="link-password" className="option-input" type="password" minLength={4} placeholder="At least 4 characters" value={password} onChange={e => setPassword(e.target.value)} /></label></div></details></form></section>
      <section className="panel links-panel"><div className="section-heading links-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h2>{archived ? "Archived links" : "Recent links"} <span className="count-badge">{urls.length}</span></h2></div><div className="library-controls"><button className={`tab-button ${!archived ? "selected" : ""}`} onClick={() => setArchivedView(false)}>Active</button><button className={`tab-button ${archived ? "selected" : ""}`} onClick={() => setArchivedView(true)}>Archived</button><label className="search-box"><span>⌕</span><input aria-label="Search links" placeholder="Search links" value={search} onChange={e => setSearch(e.target.value)} /></label></div></div>
        {urls.length === 0 ? <div className="empty-state"><div className="empty-icon">↗</div><h3>{archived ? "No archived links" : "No links yet"}</h3><p>{archived ? "Archive a link to keep it out of your active library." : "Paste a destination above to create your first short link."}</p></div> : <div className="url-list">{urls.map(url => { const id = url._id || url.id || url.shortCode; const short = url.shortUrl || `${SHORT_URL_BASE}/${url.shortCode}`; let host = url.originalUrl; try { host = new URL(url.originalUrl).hostname; } catch { /* keep original */ }
          return <article className="url-row" key={id}><div className="link-symbol">↗</div><div className="url-info"><strong className="host-name">{host}</strong><span className="original-url">{url.originalUrl}</span><div className="short-link"><a href={short} target="_blank" rel="noreferrer">{short}</a><button className="text-button" onClick={() => void copy(url.shortCode)}>Copy</button></div>{Boolean(url.tags?.length) && <div className="tag-list">{url.tags?.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>}</div><div className="url-meta"><span className="click-count">{(url.clicks || 0).toLocaleString()} <small>clicks</small></span><time>{new Date(url.createdAt).toLocaleDateString()}</time></div><div className="row-actions"><button className={`icon-button ${url.isFavorite ? "favorited" : ""}`} title={url.isFavorite ? "Remove favorite" : "Add favorite"} onClick={() => void setFavorite(url)}>★</button><Link className="icon-button" title="View analytics" to={`/analytics?code=${encodeURIComponent(url.shortCode)}`}>↗</Link><button className="icon-button" title={archived ? "Restore link" : "Archive link"} onClick={() => void setLinkArchived(url)}>{archived ? "⤴" : "▣"}</button><button className="icon-button danger-icon" title="Delete link" onClick={() => void removeUrl(id)}>×</button></div></article>;
        })}</div>}
      </section><footer className="page-footer">Short links that take you further <span>SNAPROUTE</span></footer>
    </main>
  </div>;
}
