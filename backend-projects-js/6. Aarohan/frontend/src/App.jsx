import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api } from "./api.js";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
const blocksToText = (blocks = []) =>
  blocks
    .filter((block) => block.type !== "image")
    .map(
      (block) =>
        block.text || block.content || (block.items || []).join("\n") || "",
    )
    .join("\n\n");
const initials = (name = "Reader") =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("aarohan.user") || "null"),
  );
  const [toast, setToast] = useState("");
  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);
  const signIn = (data) => {
    localStorage.setItem("aarohan.accessToken", data.accessToken);
    localStorage.setItem("aarohan.user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const signOut = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      /* local sign out still works */
    }
    localStorage.removeItem("aarohan.accessToken");
    localStorage.removeItem("aarohan.user");
    setUser(null);
    notify("You’re signed out.");
  };

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">a</span>
          <span>
            aarohan<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Explore
          </NavLink>
          {user && <NavLink to="/dashboard">My space</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <Link className="write-link" to="/write">
                ＋ Write
              </Link>
              <Link className="avatar" title={user.name} to="/dashboard">
                {initials(user.name)}
              </Link>
              <button className="text-button" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="text-button" to="/login">
                Log in
              </Link>
              <Link className="button button-dark button-small" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home user={user} notify={notify} />} />
          <Route
            path="/login"
            element={<Auth mode="login" onLogin={signIn} notify={notify} />}
          />
          <Route
            path="/register"
            element={<Auth mode="register" onLogin={signIn} notify={notify} />}
          />
          <Route
            path="/article/:slug"
            element={<ArticlePage user={user} notify={notify} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} notify={notify} />}
          />
          <Route
            path="/write"
            element={<Writer user={user} notify={notify} />}
          />
          <Route
            path="/edit/:id"
            element={<Writer user={user} notify={notify} />}
          />
          <Route
            path="/admin"
            element={<Admin user={user} notify={notify} />}
          />
          <Route
            path="*"
            element={
              <div className="empty-state">
                <span className="eyebrow">404 — Lost in the margins</span>
                <h1>This page isn’t here.</h1>
                <Link to="/" className="button button-dark">
                  Back to stories
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      <footer className="footer">
        <Link className="brand" to="/">
          <span className="brand-mark">a</span>
          <span>
            aarohan<span className="brand-dot">.</span>
          </span>
        </Link>
        <span>Thoughtful writing for curious people.</span>
        <span>© {new Date().getFullYear()} Aarohan</span>
      </footer>
    </>
  );
}

function Home({ user, notify }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const categories = [
    "All stories",
    "Design",
    "Technology",
    "Culture",
    "Business",
    "Lifestyle",
  ];
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "12",
        sort: "newest",
      });
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
      const result = await api(`/articles?${params}`);
      setArticles(result.data?.articles || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, category]);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> A home for good ideas
          </span>
          <h1>
            Stories that
            <br />
            <em>move you forward.</em>
          </h1>
          <p>
            Ideas, perspectives and stories from people who see the world a
            little differently.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#stories">
              Explore stories <span>↘</span>
            </a>
            <Link
              className="button button-quiet"
              to={user ? "/write" : "/register"}
            >
              Start writing <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-sun" />
          <div className="art-leaf leaf-one" />
          <div className="art-leaf leaf-two" />
          <div className="art-leaf leaf-three" />
          <div className="art-caption">
            <span>VOL. 01</span>
            <span>A place to begin</span>
          </div>
        </div>
        <div className="hero-index">
          <span>01 / 04</span>
          <span className="index-bar">
            <i />
          </span>
          <span>SPRING EDITION</span>
        </div>
      </section>
      <section className="story-section" id="stories">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The journal</span>
            <h2>Curated for your curiosity.</h2>
          </div>
          <span className="section-note">
            A collection of ideas worth your time.
          </span>
        </div>
        <div className="filter-row">
          <div className="categories">
            {categories.map((item) => {
              const value = item === "All stories" ? "" : item.toLowerCase();
              return (
                <button
                  key={item}
                  className={`category-chip ${category === value ? "active" : ""}`}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    value
                      ? next.set("category", value)
                      : next.delete("category");
                    setSearchParams(next);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              const next = new URLSearchParams(searchParams);
              query ? next.set("q", query) : next.delete("q");
              setSearchParams(next);
            }}
          >
            <span>⌕</span>
            <input
              aria-label="Search stories"
              value={query}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                e.target.value
                  ? next.set("q", e.target.value)
                  : next.delete("q");
                setSearchParams(next);
              }}
              placeholder="Search stories"
            />
          </form>
        </div>
        {loading ? (
          <div className="loading">
            <span className="spinner" /> Finding good stories…
          </div>
        ) : error ? (
          <div className="notice notice-error">
            {error}
            <button onClick={load}>Try again</button>
          </div>
        ) : articles.length ? (
          <div className="story-grid">
            {articles.map((article, index) => (
              <StoryCard key={article._id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <span className="eyebrow">Nothing here yet</span>
            <h3>Be the first to share a story.</h3>
            <p>We couldn’t find any published stories for this search.</p>
            <Link
              to={user ? "/write" : "/register"}
              className="button button-dark"
            >
              Write the first one
            </Link>
          </div>
        )}
      </section>
      <section className="newsletter">
        <div>
          <span className="eyebrow">A little letter from us</span>
          <h2>Make room for a new idea.</h2>
          <p>Read at your pace. Share an idea when you’re ready.</p>
        </div>
        <div className="newsletter-actions">
          <Link className="button button-cream" to={user ? "/write" : "/register"}>
            {user ? "Write a story" : "Join the journal"} <span>↗</span>
          </Link>
          <Link className="newsletter-secondary" to="/">Keep exploring</Link>
        </div>
        <span className="newsletter-flower">✳</span>
      </section>
    </>
  );
}

function StoryCard({
  article,
  index = 0,
  showStatus = false,
  onDelete,
  onPublish,
}) {
  const illustrations = [
    "card-art-olive",
    "card-art-rust",
    "card-art-blue",
    "card-art-lilac",
  ];
  const storyHref =
    showStatus && article.status !== "published"
      ? `/edit/${article._id}`
      : `/article/${article.slug}`;
  return (
    <article className="story-card">
      <Link
        to={storyHref}
        className={`story-art ${illustrations[index % illustrations.length]}`}
        aria-label={`Read ${article.title}`}
      >
        <span className="art-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="art-shape shape-a" />
        <span className="art-shape shape-b" />
        <span className="art-shape shape-c" />
        <span className="art-art-caption">AAROHAN JOURNAL</span>
      </Link>
      <div className="story-meta">
        <span>{article.category || "Ideas"}</span>
        <span>·</span>
        <span>{article.readingTime || "3 min read"}</span>
        {showStatus && (
          <span className={`status-pill ${article.status}`}>
            {article.status}
          </span>
        )}
      </div>
      <h3>
        <Link to={storyHref}>{article.title}</Link>
      </h3>
      <p className="story-excerpt">
        {article.excerpt || blocksToText(article.content).slice(0, 135)}
      </p>
      <div className="story-byline">
        <span className="mini-avatar">{initials(article.author?.name)}</span>
        <span>{article.author?.name || "Aarohan writer"}</span>
        <span className="meta-spacer" />
        {article.views || 0} reads <span>·</span>
        {formatDate(article.publishedAt || article.createdAt)}
      </div>
      {onDelete && (
        <div className="card-actions">
          <Link to={`/edit/${article._id}`}>Edit story</Link>
          {article.status !== "published" && (
            <button onClick={() => onPublish(article)}>Publish</button>
          )}
          <button className="danger-text" onClick={() => onDelete(article)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

function Auth({ mode, onLogin, notify }) {
  const [stage, setStage] = useState(mode === "register" ? "signup" : "login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resetReason, setResetReason] = useState("forgot");
  const navigate = useNavigate();
  const update = (key) => (e) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (stage === "login") {
        const result = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        onLogin(result.data);
        notify("Welcome back.");
        navigate("/dashboard");
      } else if (stage === "signup") {
        await api("/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });
        setStage("verify");
        notify("We sent a verification code to your email.");
      } else if (stage === "verify") {
        await api("/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ email: form.email, otp: form.otp }),
        });
        setStage("login");
        notify("Your email is verified. Sign in to continue.");
      } else if (stage === "forgot") {
        await api("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.email }),
        });
        setResetReason("forgot");
        setStage("reset");
        notify("A reset code is on its way.");
      } else if (stage === "reset") {
        await api("/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ email: form.email, otp: form.otp }),
        });
        await api("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            newPassword: form.newPassword,
          }),
        });
        setStage("login");
        notify("Password changed. Please sign in.");
      }
    } catch (e) {
      setError(e.message);
      if (stage === "login" && /locked/i.test(e.message)) {
        setResetReason("unlock");
        setStage("reset");
      }
    } finally {
      setBusy(false);
    }
  };
  const resendResetCode = async () => {
    setBusy(true);
    setError("");
    try {
      await api(
        resetReason === "unlock"
          ? "/auth/resend-unlock-otp"
          : "/auth/forgot-password",
        { method: "POST", body: JSON.stringify({ email: form.email }) },
      );
      notify("A new code is on its way.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const titles = {
    login: ["Welcome back.", "Pick up where your curiosity left off."],
    signup: [
      "Start with a story.",
      "Create your space for ideas worth sharing.",
    ],
    verify: ["Check your inbox.", "Enter the six-digit code we sent you."],
    forgot: ["A fresh start.", "We’ll send a reset code to your email."],
    reset: [
      "Set a new password.",
      "Verify the code and choose a new password.",
    ],
  };
  return (
    <section className="auth-layout">
      <div className="auth-art">
        <div className="auth-art-content">
          <span className="eyebrow">AAROHAN JOURNAL · EST. 2024</span>
          <h2>
            Every point of view
            <br />
            <em>opens a door.</em>
          </h2>
          <div className="auth-art-lines">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span>Ideas worth sharing.</span>
        </div>
        <span className="auth-mark">a</span>
      </div>
      <div className="auth-panel">
        <span className="eyebrow">
          {stage === "login"
            ? "Your reading room awaits"
            : "A community of curious minds"}
        </span>
        <h1>{titles[stage][0]}</h1>
        <p>{titles[stage][1]}</p>
        <form className="auth-form" onSubmit={submit}>
          {stage === "signup" && (
            <Field
              label="Your name"
              value={form.name}
              onChange={update("name")}
              placeholder="Alex Morgan"
              autoComplete="name"
            />
          )}
          {stage === "login" || stage === "signup" || stage === "forgot" ? (
            <Field
              label="Email address"
              value={form.email}
              onChange={update("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          ) : (
            <>
              <Field
                label="Email address"
                value={form.email}
                onChange={update("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Field
                label="Verification code"
                value={form.otp}
                onChange={update("otp")}
                placeholder="6-digit code"
                inputMode="numeric"
                maxLength="6"
              />
            </>
          )}
          {(stage === "login" || stage === "signup") && (
            <Field
              label="Password"
              value={form.password}
              onChange={update("password")}
              type="password"
              placeholder={
                stage === "signup" ? "At least 6 characters" : "Your password"
              }
              autoComplete={
                stage === "signup" ? "new-password" : "current-password"
              }
            />
          )}
          {stage === "reset" && (
            <Field
              label="New password"
              value={form.newPassword}
              onChange={update("newPassword")}
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          )}
          {stage === "login" && (
            <button
              type="button"
              className="inline-link align-right"
              onClick={() => setStage("forgot")}
            >
              Forgot password?
            </button>
          )}
          {stage === "reset" && (
            <button
              type="button"
              className="inline-link align-right"
              onClick={resendResetCode}
              disabled={busy}
            >
              Resend code
            </button>
          )}
          {error && <div className="notice notice-error">{error}</div>}
          <button className="button button-dark auth-submit" disabled={busy}>
            {busy
              ? "Please wait…"
              : {
                  login: "Log in",
                  signup: "Create account",
                  verify: "Verify email",
                  forgot: "Send reset code",
                  reset: "Reset password",
                }[stage]}
            <span>↗</span>
          </button>
        </form>
        <div className="auth-switch">
          {stage === "login" ? (
            <>
              New to Aarohan? <Link to="/register">Create an account</Link>
            </>
          ) : stage === "signup" ? (
            <>
              Already part of the journal? <Link to="/login">Log in</Link>
            </>
          ) : (
            <button onClick={() => setStage("login")}>Back to log in</button>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required {...props} />
    </label>
  );
}

function ArticlePage({ user, notify }) {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const result = await api(`/articles/${slug}`);
      setArticle(result.data);
      const list = await api(`/articles/${result.data._id}/comments`);
      setComments(list.data || []);
    } catch (e) {
      setError(e.message);
    }
  }, [slug]);
  useEffect(() => {
    load();
  }, [load]);
  const react = async (action) => {
    try {
      await api(`/articles/${article._id}/${action}`, { method: "POST" });
      await load();
      notify(action === "like" ? "You liked this story." : "Bookmark updated.");
    } catch (e) {
      notify(e.message);
    }
  };
  const addComment = async (e) => {
    e.preventDefault();
    try {
      await api(`/articles/${article._id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: comment }),
      });
      setComment("");
      await load();
      notify("Your comment was added.");
    } catch (e) {
      notify(e.message);
    }
  };
  if (!article)
    return (
      <div className="loading page-loading">{error || "Opening story…"}</div>
    );
  const content = Array.isArray(article.content) ? article.content : [];
  return (
    <article className="article-page">
      <Link className="back-link" to="/">
        ← Back to stories
      </Link>
      <header className="article-header">
        <span className="eyebrow">
          {article.category} <span>·</span> {article.readingTime}
        </span>
        <h1>{article.title}</h1>
        <p className="article-deck">{article.excerpt}</p>
        <div className="article-byline">
          <span className="avatar">{initials(article.author?.name)}</span>
          <div>
            <strong>{article.author?.name || "Aarohan writer"}</strong>
            <span>
              Published {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>
          <span className="meta-spacer" />
          <span>{article.views || 0} reads</span>
        </div>
      </header>
      <div className="article-cover card-art-rust">
        <span className="cover-shape cover-one" />
        <span className="cover-shape cover-two" />
        <span className="cover-label">
          AAROHAN JOURNAL · {article.category?.toUpperCase()}
        </span>
      </div>
      <div className="article-content">
        <div className="article-body">
          {content.map((block, index) => (
            <ContentBlock key={`${block.type}-${index}`} block={block} />
          ))}
          <div className="tag-row">
            {(article.tags || []).map((tag) => (
              <span className="tag" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
          <div className="article-reactions">
            <button onClick={() => react("like")}>
              ♡ <span>{article.totalLikes || 0} appreciate</span>
            </button>
            <button onClick={() => react("bookmark")}>
              ▱ <span>Save this story</span>
            </button>
            <button
              onClick={() =>
                navigator.clipboard
                  ?.writeText(window.location.href)
                  .then(() => notify("Link copied."))
              }
            >
              ↗ <span>Share</span>
            </button>
          </div>
        </div>
        <aside className="article-aside">
          <span className="eyebrow">A thought to keep</span>
          <p>
            “The more that you read, the more things you will know. The more
            that you learn, the more places you’ll go.”
          </p>
          <span>— Dr. Seuss</span>
        </aside>
      </div>
      <section className="comments-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The conversation</span>
            <h2>
              Thoughts from readers{" "}
              <span className="comment-count">{comments.length}</span>
            </h2>
          </div>
        </div>
        {user ? (
          <form className="comment-form" onSubmit={addComment}>
            <span className="avatar">{initials(user.name)}</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a thoughtful note…"
              minLength="2"
              maxLength="500"
              required
            />
            <button className="button button-dark">Post comment ↗</button>
          </form>
        ) : (
          <div className="comment-login">
            Want to join the conversation?{" "}
            <Link to="/login">Log in to comment</Link>
          </div>
        )}
        <div className="comment-list">
          {comments.map((item) => (
            <div className="comment" key={item._id}>
              <span className="avatar avatar-muted">
                {initials(item.user?.name)}
              </span>
              <div>
                <div className="comment-author">
                  <strong>{item.user?.name || "Reader"}</strong>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
          {!comments.length && (
            <p className="muted">Be the first to leave a thoughtful note.</p>
          )}
        </div>
      </section>
    </article>
  );
}

function ContentBlock({ block }) {
  if (block.type === "heading") {
    const H = `h${Math.min(6, Math.max(2, block.level || 2))}`;
    return <H>{block.text}</H>;
  }
  if (block.type === "image")
    return (
      <figure>
        <img src={block.url} alt={block.caption || ""} />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  if (block.type === "quote") return <blockquote>{block.text}</blockquote>;
  if (block.type === "code")
    return (
      <pre>
        <code>{block.content}</code>
      </pre>
    );
  if (block.type === "list") {
    const List = block.style === "ordered" ? "ol" : "ul";
    return (
      <List>
        {block.items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </List>
    );
  }
  return <p>{block.text}</p>;
}

function Dashboard({ user, notify }) {
  const [tab, setTab] = useState("stories");
  const [stories, setStories] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const load = useCallback(async () => {
    try {
      const [mine, saved] = await Promise.all([
        api("/articles/me"),
        api("/articles/bookmarks"),
      ]);
      setStories(mine.data || []);
      setBookmarks(saved.data || []);
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => {
    if (!user) navigate("/login");
    else load();
  }, [user, load, navigate]);
  const deleteArticle = async (item) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try {
      await api(`/articles/${item._id}`, { method: "DELETE" });
      await load();
      notify("Story deleted.");
    } catch (e) {
      notify(e.message);
    }
  };
  const publish = async (item) => {
    try {
      await api(`/articles/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "published" }),
      });
      await load();
      notify("Your story is live.");
    } catch (e) {
      notify(e.message);
    }
  };
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const result = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: profileName }),
      });
      const updated = { ...user, ...result.data };
      localStorage.setItem("aarohan.user", JSON.stringify(updated));
      notify("Profile updated.");
      window.location.reload();
    } catch (e) {
      notify(e.message);
    }
  };
  if (!user) return null;
  const collection = tab === "stories" ? stories : bookmarks;
  return (
    <section className="dashboard">
      <aside className="dashboard-sidebar">
        <span className="eyebrow">YOUR SPACE</span>
        <div className="profile-block">
          <span className="profile-avatar">{initials(user.name)}</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="member-label">
            {user.role === "admin" ? "Editor" : "Member"} since{" "}
            {formatDate(user.createdAt)}
          </span>
        </div>
        <nav className="dashboard-nav">
          <button
            className={tab === "stories" ? "selected" : ""}
            onClick={() => setTab("stories")}
          >
            ◫ <span>My stories</span>
            <b>{stories.length}</b>
          </button>
          <button
            className={tab === "bookmarks" ? "selected" : ""}
            onClick={() => setTab("bookmarks")}
          >
            ▱ <span>Reading list</span>
            <b>{bookmarks.length}</b>
          </button>
          <button
            className={tab === "profile" ? "selected" : ""}
            onClick={() => setTab("profile")}
          >
            ◎ <span>Profile settings</span>
          </button>
          {user.role === "admin" && (
            <Link to="/admin">
              ⌘ <span>Admin studio</span>
            </Link>
          )}
        </nav>
        <Link to="/write" className="button button-dark sidebar-write">
          ＋ Write a story
        </Link>
      </aside>
      <div className="dashboard-main">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">
              {tab === "stories"
                ? "YOUR CREATIVE WORK"
                : tab === "bookmarks"
                  ? "SAVED FOR LATER"
                  : "YOUR ACCOUNT"}
            </span>
            <h1>
              {tab === "stories"
                ? "My stories"
                : tab === "bookmarks"
                  ? "Reading list"
                  : "Profile settings"}
            </h1>
          </div>
          {tab !== "profile" && (
            <Link className="button button-dark" to="/write">
              ＋ New story
            </Link>
          )}
        </div>
        {error && (
          <div className="notice notice-error">
            {error}
            <button onClick={load}>Try again</button>
          </div>
        )}
        {tab === "profile" ? (
          <form className="profile-form" onSubmit={saveProfile}>
            <Field
              label="Display name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <label className="field">
              <span>Email address</span>
              <input value={user.email} disabled />
            </label>
            <p>Your email address is verified and cannot be changed here.</p>
            <button className="button button-dark">Save changes ↗</button>
          </form>
        ) : collection.length ? (
          <div className="dashboard-stories">
            {collection.map((article, index) => (
              <StoryCard
                key={article._id}
                article={article}
                index={index}
                showStatus={tab === "stories"}
                onDelete={tab === "stories" ? deleteArticle : null}
                onPublish={tab === "stories" ? publish : null}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <span className="eyebrow">An open page</span>
            <h3>
              {tab === "stories"
                ? "Your first story is waiting."
                : "Nothing saved just yet."}
            </h3>
            <p>
              {tab === "stories"
                ? "Shape an idea into something worth sharing."
                : "Save a story from the journal and come back anytime."}
            </p>
            <Link
              className="button button-dark"
              to={tab === "stories" ? "/write" : "/"}
            >
              {tab === "stories" ? "Write your first story" : "Explore stories"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function Writer({ user, notify }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Design",
    tags: "",
    content: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(Boolean(id));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (id)
      api("/articles/me")
        .then((result) => {
          const found = (result.data || []).find((item) => item._id === id);
          if (!found)
            throw new Error("Story not found or you don’t have access.");
          setForm({
            title: found.title,
            category: found.category,
            tags: (found.tags || []).join(", "),
            content: blocksToText(found.content),
            imageUrl:
              found.content?.find((block) => block.type === "image")?.url || "",
          });
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, [id, user, navigate]);
  const submit = async (status) => {
    setBusy(true);
    setError("");
    try {
      const content = form.content
        .split(/\n\s*\n/)
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ type: "paragraph", text }));
      if (form.imageUrl.trim()) {
        content.push({
          type: "image",
          url: form.imageUrl.trim(),
          caption: form.title,
        });
      }
      if (id) {
        await api(`/articles/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            tags: form.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            content,
          }),
        });
        await api(`/articles/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      } else {
        const result = await api("/articles", {
          method: "POST",
          body: JSON.stringify({
            title: form.title,
            category: form.category,
            tags: form.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            content,
          }),
        });
        if (status === "published")
          await api(`/articles/${result.data._id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          });
      }
      notify(
        status === "published" ? "Your story is published." : "Draft saved.",
      );
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const uploadImage = async (file) => {
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    setUploading(true);
    setError("");
    try {
      const result = await api("/upload/image", { method: "POST", body });
      setForm((current) => ({ ...current, imageUrl: result.data.imageUrl }));
      notify("Image uploaded.");
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };
  if (!user) return null;
  if (loading)
    return <div className="loading page-loading">Loading your story…</div>;
  return (
    <section className="writer">
      <div className="writer-top">
        <Link className="back-link" to="/dashboard">
          ← Back to your space
        </Link>
        <span className="eyebrow">
          {id ? "EDIT STORY" : "THE WRITER’S ROOM"}
        </span>
      </div>
      <div className="writer-header">
        <span className="eyebrow">A blank page is an invitation</span>
        <h1>{id ? "Shape it into something." : "What’s on your mind?"}</h1>
        <p>
          Take your time. The best stories start with a single honest thought.
        </p>
      </div>
      <div className="writer-form">
        <input
          className="title-input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Give your story a title…"
          maxLength="150"
        />
        <div className="writer-fields">
          <label className="field">
            <span>Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {[
                "Design",
                "Technology",
                "Culture",
                "Business",
                "Lifestyle",
                "Ideas",
              ].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <Field
            label="Tags · comma separated"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="creativity, design"
          />
        </div>
        <div className="image-upload-row">
          <label className="field image-upload">
            <span>
              Story image <small>Optional · JPG, PNG or WebP</small>
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={(e) => uploadImage(e.target.files?.[0])}
            />
          </label>
          {uploading && <span className="muted">Uploading image…</span>}
          {form.imageUrl && (
            <img className="image-preview" src={form.imageUrl} alt="Story preview" />
          )}
        </div>
        <label className="field editor-label">
          <span>
            Your story <small>Use a blank line to start a new paragraph.</small>
          </span>
          <textarea
            className="story-editor"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Begin anywhere…"
          />
        </label>
        {error && <div className="notice notice-error">{error}</div>}
        <div className="writer-bottom">
          <span>Stories are saved as drafts before publishing.</span>
          <div>
            <button
              className="button button-quiet"
              disabled={busy || !form.title || !form.content}
              onClick={() => submit("draft")}
            >
              {busy ? "Saving…" : "Save draft"}
            </button>
            <button
              className="button button-dark"
              disabled={busy || !form.title || !form.content}
              onClick={() => submit("published")}
            >
              {busy ? "Publishing…" : "Publish story ↗"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Admin({ user, notify }) {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const load = useCallback(async () => {
    try {
      const [dashboard, userResult, articleResult] = await Promise.all([
        api("/admin/dashboard"),
        api("/admin/users"),
        api("/admin/articles"),
      ]);
      setData(dashboard.data);
      setUsers(userResult.data?.users || userResult.data || []);
      setArticles(articleResult.data?.articles || articleResult.data || []);
    } catch (e) {
      setError(e.message);
    }
  }, []);
  const updateUser = async (item, path, body) => {
    try {
      await api(`/admin/users/${item._id}/${path}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      await load();
      notify("Member updated.");
    } catch (e) {
      notify(e.message);
    }
  };
  const deleteUser = async (item) => {
    if (!window.confirm(`Permanently delete ${item.name}'s account?`)) return;
    try {
      await api(`/admin/users/${item._id}`, { method: "DELETE" });
      await load();
      notify("Member deleted.");
    } catch (e) {
      notify(e.message);
    }
  };
  const moderateArticle = async (item, status) => {
    try {
      await api(`/admin/articles/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
      notify(`Story ${status}.`);
    } catch (e) {
      notify(e.message);
    }
  };
  const deleteAdminArticle = async (item) => {
    if (!window.confirm(`Permanently delete “${item.title}”?`)) return;
    try {
      await api(`/admin/articles/${item._id}`, { method: "DELETE" });
      await load();
      notify("Story deleted.");
    } catch (e) {
      notify(e.message);
    }
  };
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      notify("Admin access is required.");
    } else load();
  }, [user, load, navigate, notify]);
  if (user?.role !== "admin") return null;
  return (
    <section className="admin-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">THE EDITOR’S DESK</span>
          <h1>Admin studio</h1>
        </div>
        <Link to="/dashboard" className="back-link">
          ← Your space
        </Link>
      </div>
      {error && <div className="notice notice-error">{error}</div>}
      <div className="metrics-grid">
        {Object.entries(data || {})
          .slice(0, 4)
          .map(([key, value]) => (
            <div className="metric" key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <strong>
                {typeof value === "object" ? JSON.stringify(value) : value}
              </strong>
            </div>
          ))}
      </div>
      <div className="admin-columns">
        <div>
          <span className="eyebrow">MEMBERS · {users.length}</span>
          {users.map((item) => (
            <div className="admin-row" key={item._id}>
              <span className="mini-avatar">{initials(item.name)}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.email}</small>
              </span>
              <span className="status-pill">
                {item.role} · {item.accountStatus}
              </span>
              <div className="admin-actions">
                <button
                  onClick={() =>
                    updateUser(item, "role", { role: item.role === "admin" ? "user" : "admin" })
                  }
                >
                  {item.role === "admin" ? "Remove admin" : "Make admin"}
                </button>
                <button
                  onClick={() =>
                    updateUser(item, "status", { status: item.accountStatus === "active" ? "suspended" : "active" })
                  }
                >
                  {item.accountStatus === "active" ? "Suspend" : "Activate"}
                </button>
                <button className="danger-text" onClick={() => deleteUser(item)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="eyebrow">RECENT STORIES · {articles.length}</span>
          {articles.map((item) => (
            <div className="admin-row" key={item._id}>
              <span>
                <strong>{item.title}</strong>
                <small>{item.author?.name || "Writer"}</small>
              </span>
              <span className="status-pill">{item.status}</span>
              <div className="admin-actions">
                <select
                  aria-label={`Change status for ${item.title}`}
                  value={item.status}
                  onChange={(e) => moderateArticle(item, e.target.value)}
                >
                  {["draft", "published", "hidden", "blocked"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button className="danger-text" onClick={() => deleteAdminArticle(item)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default App;
