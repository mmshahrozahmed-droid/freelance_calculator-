"""
ai_module.py — Enhanced Machine Learning module for Freelance Price Calculator v2.0

Algorithm : Linear Regression (Scikit-learn)
Author    : Shahroz Ahmed (Group Project)
Purpose   : Predict recommended freelance project price using historical data
"""

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import os

# ─── Extended Training Dataset ────────────────────────────────────────────────
# The more data rows, the better the model accuracy.
# Columns: project_type (encoded), features_count, complexity (1-3), price (USD)

EXTENDED_DATA = {
    "project_type": [
        1, 1, 1, 1, 1, 1,          # website
        2, 2, 2, 2, 2,             # ai
        3, 3, 3, 3,                # automation
        4, 4, 4,                   # mobile_app
        5, 5, 5,                   # ecommerce
    ],
    "features_count": [
        2, 3, 1, 4, 2, 5,
        2, 3, 4, 1, 3,
        2, 1, 3, 4,
        2, 3, 4,
        3, 2, 4,
    ],
    "complexity": [
        1, 2, 1, 3, 2, 3,
        3, 3, 3, 2, 2,
        2, 1, 2, 3,
        2, 3, 3,
        2, 1, 3,
    ],
    "price": [
        600,  800, 450, 1100,  720, 1400,       # website
        1200, 1500, 1800,  900, 1300,            # ai
        900,  500, 1100, 1400,                   # automation
        1300, 1700, 2100,                        # mobile_app
        1100,  850, 1600,                        # ecommerce
    ]
}

# ─── Load or Build Dataset ────────────────────────────────────────────────────

CSV_PATH = os.path.join(os.path.dirname(__file__), "data.csv")

def load_dataset():
    """Load dataset from CSV if available, otherwise use built-in extended data."""
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        # Always encode project_type string → int (safe for all Python/pandas versions)
        type_mapping = {"website": 1, "ai": 2, "automation": 3, "mobile_app": 4, "ecommerce": 5}
        df["project_type"] = df["project_type"].map(
            lambda x: type_mapping.get(str(x).strip(), x) if isinstance(x, str) else x
        )
        # Ensure all columns are numeric floats
        df["project_type"]    = pd.to_numeric(df["project_type"],    errors="coerce").fillna(1).astype(float)
        df["features_count"]  = pd.to_numeric(df["features_count"],  errors="coerce").fillna(1).astype(float)
        df["complexity"]      = pd.to_numeric(df["complexity"],       errors="coerce").fillna(1).astype(float)
        df["price"]           = pd.to_numeric(df["price"],            errors="coerce").fillna(500).astype(float)
        return df
    return pd.DataFrame(EXTENDED_DATA)

# ─── Train Model ──────────────────────────────────────────────────────────────

df = load_dataset()
X  = df[["project_type", "features_count", "complexity"]]
y  = df["price"]

# Split for evaluation (80/20)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

# Evaluation metrics
y_pred      = model.predict(X_test)
MAE         = round(mean_absolute_error(y_test, y_pred), 2)
R2          = round(r2_score(y_test, y_pred), 4)

# ─── Public Functions ─────────────────────────────────────────────────────────

def predict_price(project_type: str, features_count: int, complexity: int) -> float:
    """
    Predict the recommended freelance project price.

    Parameters
    ----------
    project_type   : str  — e.g. 'website', 'ai', 'automation', 'mobile_app', 'ecommerce'
    features_count : int  — number of selected features
    complexity     : int  — 1=Low, 2=Medium, 3=High

    Returns
    -------
    float — predicted price in USD
    """
    type_map = {"website": 1, "ai": 2, "automation": 3, "mobile_app": 4, "ecommerce": 5}
    pt       = type_map.get(project_type, 1)
    pred     = model.predict([[pt, features_count, complexity]])
    return round(float(pred[0]), 2)


def get_model_info() -> dict:
    """Return metadata about the trained ML model for the /model-info API endpoint."""
    return {
        "algorithm":         "Linear Regression",
        "library":           "scikit-learn",
        "training_samples":  len(X_train),
        "test_samples":      len(X_test),
        "total_samples":     len(df),
        "features_used":     ["project_type (encoded)", "features_count", "complexity"],
        "target":            "price (USD)",
        "mean_absolute_error": MAE,
        "r2_score":          R2,
        "model_coefficients": model.coef_.tolist(),
        "model_intercept":   round(model.intercept_, 2),
        "accuracy_note":     "Higher R² (closer to 1.0) = better accuracy. MAE = avg dollar error.",
    }