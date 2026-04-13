from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json, os, datetime

from ai_module import predict_price, get_model_info

app = FastAPI(
    title="📟 The Earn-O-METER",
    description="AI-Powered Freelance Project Pricing System — Calculate what you're WORTH!",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ────────────────────────────────────────────────────────────────

BASE_PRICES = {
    "website":    {"price": 300,  "label": "Website",    "icon": "🌐"},
    "ai":         {"price": 500,  "label": "AI Tool",    "icon": "🤖"},
    "automation": {"price": 400,  "label": "Automation", "icon": "⚙️"},
    "mobile_app": {"price": 600,  "label": "Mobile App", "icon": "📱"},
    "ecommerce":  {"price": 450,  "label": "E-Commerce", "icon": "🛒"},
}

FEATURE_PRICES = {
    "admin_panel":    {"price": 150, "label": "Admin Panel",      "days": 3},
    "payment":        {"price": 120, "label": "Payment Gateway",  "days": 2},
    "seo":            {"price": 80,  "label": "SEO Optimization", "days": 1},
    "authentication": {"price": 90,  "label": "Authentication",   "days": 2},
    "api_integration":{"price": 110, "label": "API Integration",  "days": 2},
    "database":       {"price": 100, "label": "Database Design",  "days": 2},
    "cloud_deploy":   {"price": 130, "label": "Cloud Deployment", "days": 1},
    "analytics":      {"price": 95,  "label": "Analytics Dashboard","days": 2},
}

COMPLEXITY_MULTIPLIER = {"low": 1.0, "medium": 1.2, "high": 1.5}
COMPLEXITY_DAYS       = {"low": 5,   "medium": 9,   "high": 14}

CURRENCY_RATES = {"USD": 1.0, "PKR": 278.0, "EUR": 0.92, "GBP": 0.79, "INR": 83.4}

HISTORY_FILE = "history.json"

# ─── Models ───────────────────────────────────────────────────────────────────

class ProjectInput(BaseModel):
    project_type: str
    features: List[str]
    complexity: str
    currency: Optional[str] = "USD"
    client_name: Optional[str] = "Anonymous"
    project_name: Optional[str] = "My Project"
    experience_years: Optional[int] = 1

class CompareInput(BaseModel):
    projects: List[ProjectInput]

# ─── Helper ───────────────────────────────────────────────────────────────────

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []

def save_history(record):
    history = load_history()
    history.append(record)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history[-50:], f, indent=2)   # keep last 50 records

def calculate_core(data: ProjectInput):
    base     = BASE_PRICES.get(data.project_type, {"price": 300})["price"]
    feat_sum = sum(FEATURE_PRICES.get(f, {"price": 0})["price"] for f in data.features)
    mult     = COMPLEXITY_MULTIPLIER.get(data.complexity, 1.0)
    base_days= COMPLEXITY_DAYS.get(data.complexity, 7)
    feat_days= sum(FEATURE_PRICES.get(f, {"days": 0})["days"] for f in data.features)

    estimated  = (base + feat_sum) * mult
    # Experience bonus: +8% per year, capped at 60%
    exp_bonus  = min(data.experience_years * 0.08, 0.60)
    recommended= estimated * (1 + exp_bonus)
    timeline   = base_days + feat_days
    rate       = CURRENCY_RATES.get(data.currency, 1.0)

    complexity_map = {"low": 1, "medium": 2, "high": 3}
    ai_price = predict_price(data.project_type, len(data.features), complexity_map.get(data.complexity, 2))

    breakdown = {
        "base_price":    round(base * rate, 2),
        "features_cost": round(feat_sum * rate, 2),
        "complexity_bonus": round((estimated - base - feat_sum) * rate, 2),
        "experience_bonus": round((recommended - estimated) * rate, 2),
    }

    return {
        "estimated_price":   round(estimated * rate, 2),
        "recommended_price": round(recommended * rate, 2),
        "ai_price":          round(ai_price * rate, 2),
        "timeline_days":     timeline,
        "currency":          data.currency,
        "breakdown":         breakdown,
        "features_selected": data.features,
    }

# ─── ROUTE 1 — Price Calculation ─────────────────────────────────────────────

@app.post("/calculate-price", tags=["Pricing"])
def calculate_price(data: ProjectInput):
    """
    Core pricing endpoint. Returns rule-based + AI-recommended prices,
    timeline, currency-converted values, and a full cost breakdown.
    """
    result = calculate_core(data)

    record = {
        "timestamp":    datetime.datetime.now().isoformat(),
        "client":       data.client_name,
        "project_name": data.project_name,
        "project_type": data.project_type,
        "complexity":   data.complexity,
        "features":     data.features,
        **result
    }
    save_history(record)
    return result

# ─── ROUTE 2 — History ────────────────────────────────────────────────────────

@app.get("/history", tags=["History"])
def get_history():
    """Returns the last 50 price calculation records."""
    return load_history()

@app.delete("/history", tags=["History"])
def clear_history():
    """Clears all saved history."""
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
    return {"message": "History cleared"}

# ─── ROUTE 3 — Analytics ─────────────────────────────────────────────────────

@app.get("/analytics", tags=["Analytics"])
def get_analytics():
    """
    Aggregated analytics: total projects, average price,
    most popular project type / feature, price distribution.
    """
    history = load_history()
    if not history:
        return {"message": "No data yet"}

    prices      = [h.get("estimated_price", 0) for h in history]
    types       = [h.get("project_type", "") for h in history]
    all_features= [f for h in history for f in h.get("features", [])]

    type_counts = {}
    for t in types:
        type_counts[t] = type_counts.get(t, 0) + 1

    feat_counts = {}
    for f in all_features:
        feat_counts[f] = feat_counts.get(f, 0) + 1

    top_type    = max(type_counts, key=type_counts.get) if type_counts else "N/A"
    top_feature = max(feat_counts, key=feat_counts.get) if feat_counts else "N/A"

    return {
        "total_projects":    len(history),
        "average_price":     round(sum(prices) / len(prices), 2),
        "max_price":         max(prices),
        "min_price":         min(prices),
        "most_popular_type": top_type,
        "top_feature":       top_feature,
        "type_distribution": type_counts,
        "feature_popularity":feat_counts,
    }

# ─── ROUTE 4 — Compare Projects ──────────────────────────────────────────────

@app.post("/compare", tags=["Comparison"])
def compare_projects(data: CompareInput):
    """Calculates and compares prices for multiple project configurations."""
    if len(data.projects) < 2:
        raise HTTPException(400, "Provide at least 2 projects to compare")
    results = []
    for proj in data.projects:
        r = calculate_core(proj)
        r["project_name"] = proj.project_name
        r["project_type"] = proj.project_type
        results.append(r)
    return {"comparison": results}

# ─── ROUTE 5 — AI Model Info ─────────────────────────────────────────────────

@app.get("/model-info", tags=["AI Model"])
def model_info():
    """Returns metadata about the trained ML model (algorithm, accuracy, training size)."""
    return get_model_info()

# ─── ROUTE 6 — Currency Rates ────────────────────────────────────────────────

@app.get("/currencies", tags=["Currency"])
def list_currencies():
    """Lists all supported currencies and their exchange rates (base: USD)."""
    return {"base": "USD", "rates": CURRENCY_RATES}

# ─── ROUTE 7 — Feature Catalog ───────────────────────────────────────────────

@app.get("/features", tags=["Catalog"])
def list_features():
    """Returns all available project types and features with prices."""
    return {
        "project_types": {k: v for k, v in BASE_PRICES.items()},
        "features":      {k: v for k, v in FEATURE_PRICES.items()},
        "complexity":    COMPLEXITY_MULTIPLIER,
        "currencies":    list(CURRENCY_RATES.keys()),
    }

# ─── Root ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "message":  "💼 Freelance Price Calculator API v2.0",
        "docs":     "/docs",
        "endpoints": [
            "POST /calculate-price",
            "GET  /history",
            "GET  /analytics",
            "POST /compare",
            "GET  /model-info",
            "GET  /currencies",
            "GET  /features",
        ]
    }