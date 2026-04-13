import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:8000";

const PROJECT_ICONS = {
  website: "🌐", ai: "🤖", automation: "⚙️", mobile_app: "📱", ecommerce: "🛒",
};
const FEATURE_ICONS = {
  admin_panel: "🔧", payment: "💳", seo: "🔍", authentication: "🔐",
  api_integration: "🔗", database: "🗄️", cloud_deploy: "☁️", analytics: "📊",
};
const CURR_SYMBOL = { USD: "$", PKR: "₨", EUR: "€", GBP: "£", INR: "₹" };

// ── SVG Meter Logo ────────────────────────────────────────────────────────────
function MeterLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" stroke="rgba(255,184,0,0.25)" strokeWidth="2" />
      <path d="M 10 34 A 16 16 0 1 1 38 34" stroke="#ffb800" strokeWidth="2.5" strokeLinecap="round" fill="none"
        strokeDasharray="5 3" />
      <path d="M 10 34 A 16 16 0 0 1 34 12" stroke="#00f5a0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="24" r="3" fill="#ffb800" />
      <line x1="24" y1="24" x2="33" y2="14" stroke="#ffb800" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="1.5" fill="#0a0800" />
    </svg>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  const icons = { success: "✅", error: "❌", info: "💡" };
  return (
    <div className={`toast toast-${type}`}>
      <span>{icons[type]}</span>
      <span>{msg}</span>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimNum({ value, pre = "", suf = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = value / 45;
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) { setN(value); clearInterval(t); }
      else setN(Math.round(cur));
    }, 18);
    return () => clearInterval(t);
  }, [value]);
  return <span>{pre}{n.toLocaleString()}{suf}</span>;
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function Prog({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="prog-row">
      <span className="prog-label">{label}</span>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="prog-count">{value}</span>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "calculator", label: "Calculator",  icon: "🎯" },
  { id: "compare",    label: "Compare",     icon: "⚖️" },
  { id: "history",    label: "History",     icon: "📋" },
  { id: "analytics",  label: "Analytics",   icon: "📊" },
  { id: "model",      label: "AI Model",    icon: "🧠" },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab]           = useState("calculator");
  const [loading, setLoading]               = useState(false);
  const [toast, setToast]                   = useState(null);
  const [catalog, setCatalog]               = useState({});
  const [currencies, setCurrencies]         = useState({});

  // Calculator
  const [form, setForm] = useState({
    project_type: "website", features: [], complexity: "medium",
    currency: "USD", client_name: "", project_name: "",
    experience_years: 2,
  });
  const [result,      setResult]      = useState(null);
  const [history,     setHistory]     = useState([]);
  const [analytics,   setAnalytics]   = useState(null);
  const [modelInfo,   setModelInfo]   = useState(null);

  // Compare
  const [ca, setCa] = useState({ project_type:"website", features:[], complexity:"low",  currency:"USD", project_name:"Option A" });
  const [cb, setCb] = useState({ project_type:"ai",      features:[], complexity:"high", currency:"USD", project_name:"Option B" });
  const [cmpResult, setCmpResult] = useState(null);

  const toast$ = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    fetch(`${API}/features`).then(r => r.json()).then(setCatalog).catch(() => {});
    fetch(`${API}/currencies`).then(r => r.json()).then(d => setCurrencies(d.rates || {})).catch(() => {});
  }, []);

  const fetchHistory   = useCallback(() => fetch(`${API}/history`).then(r=>r.json()).then(setHistory).catch(()=>{}), []);
  const fetchAnalytics = useCallback(() => fetch(`${API}/analytics`).then(r=>r.json()).then(setAnalytics).catch(()=>{}), []);
  const fetchModel     = useCallback(() => fetch(`${API}/model-info`).then(r=>r.json()).then(setModelInfo).catch(()=>{}), []);

  useEffect(() => {
    if (activeTab === "history")   fetchHistory();
    if (activeTab === "analytics") fetchAnalytics();
    if (activeTab === "model")     fetchModel();
  }, [activeTab, fetchHistory, fetchAnalytics, fetchModel]);

  const toggleFeature = (key, setFn) =>
    setFn(p => ({
      ...p,
      features: p.features.includes(key) ? p.features.filter(f => f !== key) : [...p.features, key],
    }));

  const calculate = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/calculate-price`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setResult(await r.json());
      toast$("Earnings estimated! 💰");
    } catch {
      toast$("Backend not running. Start FastAPI first!", "error");
    } finally { setLoading(false); }
  };

  const compare = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/compare`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: [ca, cb] }),
      });
      const d = await r.json();
      setCmpResult(d.comparison);
      toast$("Comparison done!");
    } catch {
      toast$("Backend not running!", "error");
    } finally { setLoading(false); }
  };

  const clearHistory = async () => {
    await fetch(`${API}/history`, { method: "DELETE" });
    setHistory([]);
    toast$("History cleared", "info");
  };

  const pTypes   = catalog.project_types || {};
  const pFeats   = catalog.features      || {};
  const currKeys = Object.keys(currencies);
  const sym      = CURR_SYMBOL[form.currency] || "$";

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="app">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-meter"><MeterLogo /></div>
            <div className="logo-text">
              <span className="logo-the">The</span>
              <span className="logo-title">Earn-O-METER</span>
            </div>
          </div>
          <div className="header-right">
            <div className="badge-ai">
              <div className="badge-dot" />
              AI-Powered Pricing
            </div>
            <div className="badge-version">v2.0</div>
          </div>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="main">

        {/* ═══════ CALCULATOR ═══════════════════════════════════════════ */}
        {activeTab === "calculator" && (
          <div className="two-col">

            {/* LEFT — Form */}
            <div className="card form-card">
              <div className="card-title">🎯 Project Details</div>

              {/* Names */}
              <div className="form-text-row">
                <div className="field">
                  <div className="field-label">👤 Client Name</div>
                  <input
                    placeholder="e.g. Ali Khan"
                    value={form.client_name}
                    onChange={e => setForm({ ...form, client_name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <div className="field-label">📌 Project Name</div>
                  <input
                    placeholder="e.g. Portfolio Site"
                    value={form.project_name}
                    onChange={e => setForm({ ...form, project_name: e.target.value })}
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="field">
                <div className="field-label">🚀 Project Type</div>
                <div className="type-grid">
                  {Object.entries(pTypes).map(([k, v]) => (
                    <button
                      key={k}
                      className={`type-card ${form.project_type === k ? "type-active" : ""}`}
                      onClick={() => setForm({ ...form, project_type: k })}
                    >
                      <span className="type-emoji">{v.icon || PROJECT_ICONS[k] || "💼"}</span>
                      <span className="type-name">{v.label || k}</span>
                      <span className="type-base">${v.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="field">
                <div className="field-label">
                  ⚡ Features
                  <span className="badge-count">{form.features.length} selected</span>
                </div>
                <div className="feature-grid">
                  {Object.entries(pFeats).map(([k, v]) => {
                    const on = form.features.includes(k);
                    return (
                      <label key={k} className={`feature-chip ${on ? "chip-active" : ""}`}>
                        <input type="checkbox" hidden checked={on}
                          onChange={() => toggleFeature(k, setForm)} />
                        <span className="chip-icon">{FEATURE_ICONS[k] || "🔹"}</span>
                        <span className="chip-name">{v.label || k}</span>
                        <span className="chip-plus">+${v.price}</span>
                        {on && <span className="chip-check">✓</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Complexity + Experience + Currency */}
              <div className="field">
                <div className="field-label">🎚️ Complexity Level</div>
                <div className="complexity-seg">
                  {[
                    { id:"low",    emoji:"🟢", label:"Low" },
                    { id:"medium", emoji:"🟡", label:"Medium" },
                    { id:"high",   emoji:"🔴", label:"High" },
                  ].map(c => (
                    <button
                      key={c.id}
                      className={`seg-btn seg-${c.id} ${form.complexity === c.id ? "seg-active" : ""}`}
                      onClick={() => setForm({ ...form, complexity: c.id })}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-bottom-row">
                <div className="field" style={{ gridColumn: "1 / 3" }}>
                  <div className="field-label">🌟 Years of Experience</div>
                  <div className="range-wrap">
                    <div className="range-val">
                      {form.experience_years} <span>yrs &nbsp;(+{Math.min(form.experience_years * 8, 60)}% bonus)</span>
                    </div>
                    <input
                      type="range" min="0" max="15" value={form.experience_years}
                      onChange={e => setForm({ ...form, experience_years: +e.target.value })}
                    />
                    <div className="range-labels"><span>0</span><span>15 yrs</span></div>
                  </div>
                </div>
                <div className="field">
                  <div className="field-label">💱 Currency</div>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    {currKeys.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button className="btn-calc" onClick={calculate} disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Calculating…</>
                  : "⚡ Calculate My Earnings"
                }
              </button>
            </div>

            {/* RIGHT — Result */}
            <div className="card">
              {!result ? (
                <div className="result-placeholder">
                  <div className="placeholder-art">📟</div>
                  <div className="placeholder-text">
                    Fill in your project details on the left and hit<br />
                    <strong style={{ color: "var(--gold-light)" }}>⚡ Calculate My Earnings</strong>
                    <br />to see your AI-powered price estimate.
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-title">💰 Your Earnings Estimate</div>

                  {/* 4 price boxes */}
                  <div className="price-grid">
                    <div className="price-box price-est">
                      <div className="price-tag">📐 Rule-Based Estimate</div>
                      <div className="price-val">
                        <span className="currency-sup">{sym}</span>
                        <AnimNum value={result.estimated_price} />
                      </div>
                    </div>
                    <div className="price-box price-rec">
                      <div className="price-tag">⭐ Your Recommended Rate</div>
                      <div className="price-val">
                        <span className="currency-sup">{sym}</span>
                        <AnimNum value={result.recommended_price} />
                      </div>
                    </div>
                    <div className="price-box price-ai">
                      <div className="price-tag">🤖 AI Prediction</div>
                      <div className="price-val">
                        <span className="currency-sup">{sym}</span>
                        <AnimNum value={result.ai_price} />
                      </div>
                    </div>
                    <div className="price-box price-time">
                      <div className="price-tag">⏱️ Project Timeline</div>
                      <div className="price-val">
                        <AnimNum value={result.timeline_days} suf=" days" />
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="breakdown">
                    <div className="breakdown-title">💡 Cost Breakdown</div>
                    {Object.entries(result.breakdown || {}).map(([k, v]) => (
                      <div className="breakdown-row" key={k}>
                        <span className="breakdown-key">
                          {k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                        <span className="breakdown-val">{sym}{Number(v).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  {result.features_selected?.length > 0 && (
                    <div>
                      <div className="feat-result-title">✅ Selected Features</div>
                      <div className="feature-tags">
                        {result.features_selected.map(f => (
                          <span key={f} className="ftag">
                            {FEATURE_ICONS[f] || "🔹"} {f.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ═══════ COMPARE ══════════════════════════════════════════════ */}
        {activeTab === "compare" && (
          <div className="card">
            <div className="card-title">⚖️ Compare Two Projects</div>
            <div className="compare-grid">
              {[
                { label: "Option A", state: ca, setFn: setCa, cls: "col-a" },
                { label: "Option B", state: cb, setFn: setCb, cls: "col-b" },
              ].map(({ label, state, setFn, cls }) => (
                <div key={label} className={`compare-col ${cls}`}>
                  <div className="compare-col-heading">{label}</div>
                  <div className="field">
                    <div className="field-label">📌 Project Name</div>
                    <input value={state.project_name}
                      onChange={e => setFn({ ...state, project_name: e.target.value })} />
                  </div>
                  <div className="field">
                    <div className="field-label">🚀 Type</div>
                    <select value={state.project_type}
                      onChange={e => setFn({ ...state, project_type: e.target.value })}>
                      {Object.entries(pTypes).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon || PROJECT_ICONS[k]} {v.label || k}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <div className="field-label">🎚️ Complexity</div>
                    <select value={state.complexity}
                      onChange={e => setFn({ ...state, complexity: e.target.value })}>
                      {["low", "medium", "high"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <div className="field-label">⚡ Features</div>
                    <div className="feature-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      {Object.entries(pFeats).map(([k, v]) => {
                        const on = state.features.includes(k);
                        return (
                          <label key={k} className={`feature-chip ${on ? "chip-active" : ""}`}>
                            <input type="checkbox" hidden checked={on}
                              onChange={() => toggleFeature(k, setFn)} />
                            <span className="chip-icon" style={{ fontSize: "13px" }}>{FEATURE_ICONS[k] || "🔹"}</span>
                            <span className="chip-name" style={{ fontSize: "11px" }}>{v.label || k}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-calc" style={{ marginTop: "20px" }}
              onClick={compare} disabled={loading}>
              {loading ? <><span className="spinner" /> Comparing…</> : "⚖️ Compare Now"}
            </button>

            {cmpResult && cmpResult.length >= 2 && (
              <div className="compare-results">
                {cmpResult.map((r, i) => (
                  <div key={i} className={`cmp-box cmp-box-${i === 0 ? "a" : "b"}`}>
                    <div className="cmp-label">{r.project_name}</div>
                    <div className="cmp-price">${r.estimated_price?.toLocaleString()}</div>
                    <div className="cmp-meta">
                      🧠 AI: ${r.ai_price?.toLocaleString()}<br />
                      ⏱ {r.timeline_days} days &nbsp;·&nbsp;
                      🔧 {r.features_selected?.length || 0} features
                    </div>
                  </div>
                ))}
                <div className="cmp-winner">
                  <span className="cmp-winner-icon">🏆</span>
                  {(() => {
                    const diff = Math.abs(cmpResult[0].estimated_price - cmpResult[1].estimated_price);
                    const pct  = Math.round((diff / Math.max(cmpResult[0].estimated_price, cmpResult[1].estimated_price)) * 100);
                    const cheaper = cmpResult[0].estimated_price < cmpResult[1].estimated_price
                      ? cmpResult[0].project_name : cmpResult[1].project_name;
                    return `${cheaper} is ${pct}% more affordable`;
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ HISTORY ══════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="card">
            <div className="card-title-row">
              <div className="card-title">📋 Calculation History</div>
              {history.length > 0 && (
                <button className="btn-danger" onClick={clearHistory}>🗑 Clear All</button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="empty-state">
                <div className="e-icon">📭</div>
                <p>No history yet. Calculate your first project to see records here!</p>
              </div>
            ) : (
              <div className="history-list">
                {[...history].reverse().map((h, i) => (
                  <div key={i} className="history-item">
                    <span className="history-emoji">{PROJECT_ICONS[h.project_type] || "💼"}</span>
                    <div className="history-body">
                      <div className="history-title">{h.project_name || "Unnamed Project"}</div>
                      <div className="history-sub">
                        {h.client || "Anonymous"}
                        <span className="history-sep">·</span>
                        {h.project_type}
                        <span className="history-sep">·</span>
                        {h.complexity} complexity
                        <span className="history-sep">·</span>
                        {new Date(h.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="history-right">
                      <span className="history-price">${h.estimated_price?.toLocaleString()}</span>
                      <span className="history-days">⏱ {h.timeline_days} days</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════ ANALYTICS ════════════════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div className="card">
            <div className="card-title">📊 Analytics Dashboard</div>
            {!analytics || analytics.message ? (
              <div className="empty-state">
                <div className="e-icon">📊</div>
                <p>Calculate a few projects first to generate analytics insights.</p>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  {[
                    { cls: "stat-box-1", icon: "💼", val: analytics.total_projects, label: "Total Projects" },
                    { cls: "stat-box-2", icon: "💵", val: `$${(analytics.average_price || 0).toLocaleString()}`, raw: true, label: "Avg Price" },
                    { cls: "stat-box-3", icon: "🔺", val: `$${(analytics.max_price || 0).toLocaleString()}`,     raw: true, label: "Highest" },
                    { cls: "stat-box-4", icon: "🔻", val: `$${(analytics.min_price || 0).toLocaleString()}`,     raw: true, label: "Lowest" },
                  ].map((s, i) => (
                    <div key={i} className={`stat-box ${s.cls}`}>
                      <div className="stat-icon">{s.icon}</div>
                      <span className="stat-num">{s.val}</span>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="analytics-row">
                  <div className="analytics-col">
                    <h3>Project Types</h3>
                    {Object.entries(analytics.type_distribution || {}).map(([t, c]) => (
                      <Prog key={t} label={`${PROJECT_ICONS[t] || "💼"} ${t}`}
                        value={c} max={analytics.total_projects} color="var(--gold)" />
                    ))}
                  </div>
                  <div className="analytics-col">
                    <h3>Feature Popularity</h3>
                    {Object.entries(analytics.feature_popularity || {})
                      .sort((a, b) => b[1] - a[1]).slice(0, 6)
                      .map(([f, c]) => (
                        <Prog key={f} label={`${FEATURE_ICONS[f] || "🔹"} ${f.replace(/_/g, " ")}`}
                          value={c} max={analytics.total_projects} color="var(--neon)" />
                      ))}
                  </div>
                </div>

                <div className="insight-cards">
                  <div className="insight-card">
                    <span className="insight-icon">🏆</span>
                    <div className="insight-info">
                      <span>Most Popular Type</span>
                      <strong>{PROJECT_ICONS[analytics.most_popular_type]} {analytics.most_popular_type}</strong>
                    </div>
                  </div>
                  <div className="insight-card">
                    <span className="insight-icon">⭐</span>
                    <div className="insight-info">
                      <span>Most Requested Feature</span>
                      <strong>{FEATURE_ICONS[analytics.top_feature]} {analytics.top_feature?.replace(/_/g, " ")}</strong>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════ AI MODEL ═════════════════════════════════════════════ */}
        {activeTab === "model" && (
          <div className="card">
            <div className="card-title">🧠 AI Model Details</div>
            {!modelInfo ? (
              <div className="empty-state">
                <div className="lg-spinner" />
              </div>
            ) : (
              <>
                <div className="model-header">
                  <div className="model-brain">🤖</div>
                  <div>
                    <div className="card-title" style={{ marginBottom: 4 }}>
                      {modelInfo.algorithm} &nbsp;
                      <span style={{ color: "var(--gold-light)", fontSize: "13px" }}>via {modelInfo.library}</span>
                    </div>
                    <div className="model-tagline">{modelInfo.accuracy_note}</div>
                  </div>
                </div>

                <div className="model-grid">
                  {[
                    { icon: "📈", label: "R² Score",      val: modelInfo.r2_score,            cls: modelInfo.r2_score > 0.8 ? "good" : "warn" },
                    { icon: "📉", label: "Mean Abs Error", val: `$${modelInfo.mean_absolute_error}`, cls: "" },
                    { icon: "🗄️", label: "Training Rows", val: modelInfo.training_samples,    cls: "" },
                    { icon: "🧪", label: "Test Rows",      val: modelInfo.test_samples,        cls: "" },
                    { icon: "📦", label: "Total Samples",  val: modelInfo.total_samples,       cls: "" },
                    { icon: "🎯", label: "Target",         val: modelInfo.target,              cls: "" },
                  ].map((m, i) => (
                    <div key={i} className="model-stat">
                      <div className="model-stat-icon">{m.icon}</div>
                      <div className="model-stat-label">{m.label}</div>
                      <div className={`model-stat-val ${m.cls}`}>{m.val}</div>
                    </div>
                  ))}
                </div>

                <div className="model-features-section">
                  <div className="section-label">📥 Input Features Used</div>
                  <div className="feature-pills">
                    {modelInfo.features_used?.map(f => (
                      <span key={f} className="feat-pill">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="section-label" style={{ marginBottom: 10 }}>📐 Model Coefficients</div>
                <div className="coeff-row">
                  {["project_type", "features_count", "complexity"].map((n, i) => (
                    <div key={n} className="coeff-card">
                      <div className="coeff-name">{n.replace(/_/g, " ")}</div>
                      <div className="coeff-val">{modelInfo.model_coefficients?.[i]?.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="model-note">
                  <span className="note-icon">📌</span>
                  <span>
                    Intercept: <strong style={{ color: "var(--gold-light)" }}>{modelInfo.model_intercept}</strong>
                    &nbsp;· Formula: price = (intercept) + (type×coeff) + (features×coeff) + (complexity×coeff)
                  </span>
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div style={{ marginBottom: 6 }}>
          The <strong>Earn-O-METER</strong> — AI-Powered Freelance Price Estimator
        </div>
        <div className="footer-stack">
          <span className="stack-pill">⚛️ React</span>
          <span className="stack-pill">⚡ FastAPI</span>
          <span className="stack-pill">🧠 Scikit-learn</span>
          <span className="stack-pill">🐍 Python</span>
        </div>
        <div style={{ marginTop: 8 }}>
          Built by <strong>Shahroz Ahmed</strong> &amp; Group Members
        </div>
      </footer>
    </div>
  );
}