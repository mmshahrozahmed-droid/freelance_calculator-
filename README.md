# 💼 FreelanceCalc AI — Advanced Freelance Price Calculator v2.0

> An AI-powered full-stack web application that calculates freelance project pricing using both
> **rule-based business logic** and a **machine learning model (Linear Regression)**.

---

## 🚀 What's New in v2.0

| Feature | v1.0 | v2.0 |
|---|---|---|
| Project Types | 3 | **5** (+ Mobile App, E-Commerce) |
| Features to Choose | 3 | **8** (+ Auth, API, DB, Cloud, Analytics) |
| Currency Support | USD only | **5 currencies** (USD, PKR, EUR, GBP, INR) |
| AI Model Info | Hidden | **Exposed via `/model-info`** |
| History | None | **Saved + viewable + clearable** |
| Analytics | None | **Full dashboard with charts** |
| Compare | None | **Side-by-side project comparison** |
| Training Data | 7 rows | **21 rows (3× more accurate ML)** |
| UI Theme | Basic white | **Premium dark glassmorphism** |
| API Endpoints | 1 | **7 endpoints** |

---

## 🏗️ Project Structure

```
freelance-price-calculator/
│
├── backend/
│   ├── main.py         ← FastAPI server (7 endpoints)
│   ├── ai_module.py    ← ML model (Linear Regression + evaluation)
│   ├── data.csv        ← Training dataset (21 rows)
│   ├── history.json    ← Auto-created: stores last 50 calculations
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── App.js      ← React app (5 tabs)
│       └── App.css     ← Premium dark UI
│
└── README.md
```

---

## 🧠 Architecture (7 Sections for 7 Group Members)

### 👤 Member 1 — React Frontend & UI/UX (App.js + App.css)

**Responsibility:** Build and style the user interface.

The frontend is a **React Single Page Application** with 5 tabs:
- **Calculator** – User fills in project details and gets instant AI pricing
- **Compare** – Side-by-side comparison of two project options
- **History** – Browse and clear past calculations
- **Analytics** – Stats dashboard (avg price, popular features, type distribution)
- **AI Model** – Shows model algorithm, accuracy (R²), MAE, and coefficients

Technical highlights:
- State managed with `useState` / `useEffect`
- Async API calls with `fetch()`
- Animated number counter (AnimatedNumber component)
- Toast notification system
- CSS custom properties (design tokens)

---

### 👤 Member 2 — FastAPI Backend (main.py)

**Responsibility:** Build the REST API layer.

**7 Endpoints:**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/calculate-price` | Main price calculation |
| GET | `/history` | Fetch last 50 calculations |
| DELETE | `/history` | Clear all history |
| GET | `/analytics` | Aggregated stats |
| POST | `/compare` | Compare 2 projects |
| GET | `/model-info` | ML model metadata |
| GET | `/features` | Product/feature catalog |
| GET | `/currencies` | Supported currencies |

**Key concepts:**
- **Pydantic models** for request validation
- **CORS middleware** for frontend-backend communication
- **Exception handling** with `HTTPException`

---

### 👤 Member 3 — Machine Learning Module (ai_module.py)

**Responsibility:** Train and serve the ML prediction model.

**Algorithm:** Linear Regression (`scikit-learn`)

**How the model works:**
1. Reads 21 training samples from `data.csv`
2. Encodes categorical `project_type` string → integer (website=1, ai=2 …)
3. Splits data 80% train / 20% test
4. Trains `LinearRegression` model
5. Evaluates with `R² Score` and `Mean Absolute Error (MAE)`
6. Exposes `predict_price(type, features_count, complexity)` function

**Input features (X):**
- `project_type` (encoded int)
- `features_count` (int)
- `complexity` (1=low, 2=med, 3=high)

**Output (y):** Predicted price in USD

---

### 👤 Member 4 — Pricing Business Logic (main.py constants)

**Responsibility:** Define the rule-based pricing system.

The calculator uses **two pricing engines** that run in parallel:
1. **Rule-Based Engine** — Deterministic formula
2. **AI Engine** — ML prediction

Rule-based formula:
```
estimated_price = (base_price + sum(feature_costs)) × complexity_multiplier
recommended_price = estimated_price × (1 + experience_bonus)
```

**Experience Bonus:** `+8% per year of experience`, capped at `+60%`

**Base Prices:**
| Type | Base Price |
|---|---|
| Website | $300 |
| AI Tool | $500 |
| Automation | $400 |
| Mobile App | $600 |
| E-Commerce | $450 |

---

### 👤 Member 5 — Currency System & Data Models

**Responsibility:** Multi-currency support and Pydantic schema design.

**5 Currencies Supported:**
| Currency | Rate (vs USD) |
|---|---|
| USD | 1.0 |
| PKR | 278.0 |
| EUR | 0.92 |
| GBP | 0.79 |
| INR | 83.4 |

All prices are computed in USD internally, then multiplied by the chosen rate.

**Pydantic Models:**
```python
class ProjectInput(BaseModel):
    project_type: str
    features: List[str]
    complexity: str
    currency: Optional[str] = "USD"
    client_name: Optional[str]
    project_name: Optional[str]
    experience_years: Optional[int] = 1
```

---

### 👤 Member 6 — History & Analytics System

**Responsibility:** Data persistence and aggregated reporting.

**History System:**
- Every calculation is saved to `history.json` (max 50 records)
- Each record contains: timestamp, client, project name, type, complexity, features, and all price fields
- Frontend displays records in reverse chronological order
- Clearable via DELETE `/history`

**Analytics Engine (GET /analytics):**
Computes from saved history:
- Total project count
- Average / min / max price
- Type distribution (used for bar charts in UI)
- Feature popularity ranking
- Most popular project type and top feature

---

### 👤 Member 7 — Project Comparison & Deployment

**Responsibility:** Comparison feature and production deployment strategy.

**Comparison System:**
- User configures Project A and Project B independently
- Both calculations run in a single `POST /compare` API call
- Result shows prices, timelines, features side by side
- Automatically identifies the cheaper option with a percentage difference

**Deployment Plan:**

| Layer | Service | Free Tier? |
|---|---|---|
| Frontend (React) | Vercel | ✅ Yes |
| Backend (FastAPI) | Render | ✅ Yes |
| ML Model | Bundled with backend | ✅ Yes |

```bash
# Backend deployment (Render)
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT

# Frontend deployment (Vercel)
npm run build
# Upload /build folder to Vercel
```

---

## ⚙️ Installation & Setup

### Backend (FastAPI + Python)
```bash
cd backend
pip install fastapi uvicorn pydantic pandas scikit-learn
uvicorn main:app --reload
```
Open API docs: http://localhost:8000/docs

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
Open: http://localhost:3000

---

## 🌐 API Quick Reference

### POST /calculate-price
```json
{
  "project_type": "website",
  "features": ["admin_panel", "payment", "seo"],
  "complexity": "medium",
  "currency": "PKR",
  "client_name": "Ali Khan",
  "project_name": "Portfolio Website",
  "experience_years": 3
}
```

### Response
```json
{
  "estimated_price": 311760,
  "recommended_price": 374112,
  "ai_price": 295000,
  "timeline_days": 12,
  "currency": "PKR",
  "breakdown": {
    "base_price": 83400,
    "features_cost": 105560,
    "complexity_bonus": 37800,
    "experience_bonus": 62352
  },
  "features_selected": ["admin_panel", "payment", "seo"]
}
```

---

## 👨‍💻 Team

| Member | Responsibility |
|---|---|
| Member 1 | React Frontend & UI/UX |
| Member 2 | FastAPI Backend & REST API |
| Member 3 | ML Model (ai_module.py) |
| Member 4 | Business Logic & Pricing Rules |
| Member 5 | Currency System & Data Models |
| Member 6 | History & Analytics System |
| Member 7 | Comparison Feature & Deployment |

**Author:** Shahroz Ahmed & Group

---

## ⭐ Tech Stack

- **Frontend:** React.js, CSS (Custom Dark Design System)
- **Backend:** FastAPI, Uvicorn, Pydantic
- **ML/AI:** Scikit-learn (Linear Regression), Pandas
- **Deployment:** Vercel (frontend), Render (backend)
