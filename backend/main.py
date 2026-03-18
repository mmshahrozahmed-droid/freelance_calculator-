# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow all for now
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app = FastAPI()

# # ----- Pricing Data -----
# BASE_PRICES = {
#     "website": 300,
#     "ai": 500,
#     "automation": 400
# }

# FEATURE_PRICES = {
#     "admin_panel": 150,
#     "payment": 120,
#     "seo": 80
# }

# COMPLEXITY_MULTIPLIER = {
#     "low": 1.0,
#     "medium": 1.2,
#     "high": 1.5
# }

# # ----- Request Model -----
# class ProjectInput(BaseModel):
#     project_type: str
#     features: List[str]
#     complexity: str

# # ----- Price Calculator -----
# @app.post("/calculate-price")
# def calculate_price(data: ProjectInput):

#     base_price = BASE_PRICES.get(data.project_type, 0)

#     feature_cost = sum(FEATURE_PRICES.get(f, 0) for f in data.features)

#     multiplier = COMPLEXITY_MULTIPLIER.get(data.complexity, 1)

#     estimated_price = (base_price + feature_cost) * multiplier

#     # Simple AI (fake logic for now)
#     recommended_price = estimated_price * 1.1

#     timeline_days = 5 + len(data.features) * 2

#     return {
#         "estimated_price": round(estimated_price, 2),
#         "recommended_price": round(recommended_price, 2),
#         "timeline_days": timeline_days
#     }

# # from fastapi.middleware.cors import CORSMiddleware

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List
# from ai_module import predict_price

# app = FastAPI()

# # ✅ ADD THIS CORS CONFIG (IMPORTANT)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ----- Pricing Data -----
# BASE_PRICES = {
#     "website": 300,
#     "ai": 500,
#     "automation": 400
# }

# FEATURE_PRICES = {
#     "admin_panel": 150,
#     "payment": 120,
#     "seo": 80
# }

# COMPLEXITY_MULTIPLIER = {
#     "low": 1.0,
#     "medium": 1.2,
#     "high": 1.5
# }

# class ProjectInput(BaseModel):
#     project_type: str
#     features: List[str]
#     complexity: str

# # @app.post("/calculate-price")
# # def calculate_price(data: ProjectInput):
# #     base_price = BASE_PRICES.get(data.project_type, 0)
# #     feature_cost = sum(FEATURE_PRICES.get(f, 0) for f in data.features)
# #     multiplier = COMPLEXITY_MULTIPLIER.get(data.complexity, 1)

# #     estimated_price = (base_price + feature_cost) * multiplier
# #     recommended_price = estimated_price * 1.1
# #     timeline_days = 5 + len(data.features) * 2

# #     return {
# #         "estimated_price": round(estimated_price, 2),
# #         "recommended_price": round(recommended_price, 2),
# #         "timeline_days": timeline_days
# #     }
# @app.post("/calculate-price")
# def calculate_price(data: ProjectInput):

#     base_price = BASE_PRICES.get(data.project_type, 0)
#     feature_cost = sum(FEATURE_PRICES.get(f, 0) for f in data.features)
#     multiplier = COMPLEXITY_MULTIPLIER.get(data.complexity, 1)

#     estimated_price = (base_price + feature_cost) * multiplier

#     # Convert complexity to number for AI
#     complexity_map = {"low": 1, "medium": 2, "high": 3}

#     ai_price = predict_price(
#         data.project_type,
#         len(data.features),
#         complexity_map.get(data.complexity, 2)
#     )

#     timeline_days = 5 + len(data.features) * 2

#     return {
#         "estimated_price": round(estimated_price, 2),
#         "recommended_price": ai_price,  # AI OUTPUT 🔥
#         "timeline_days": timeline_days
#     }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Import AI model function
from ai_module import predict_price

app = FastAPI()

# Enable CORS so React frontend can call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Base Pricing Rules ----------

BASE_PRICES = {
    "website": 300,
    "ai": 500,
    "automation": 400
}

FEATURE_PRICES = {
    "admin_panel": 150,
    "payment": 120,
    "seo": 80
}

COMPLEXITY_MULTIPLIER = {
    "low": 1.0,
    "medium": 1.2,
    "high": 1.5
}

# ---------- Input Schema ----------

class ProjectInput(BaseModel):
    project_type: str
    features: List[str]
    complexity: str


# ---------- API Endpoint ----------

@app.post("/calculate-price")
def calculate_price(data: ProjectInput):

    # Base price
    base_price = BASE_PRICES.get(data.project_type, 0)

    # Feature cost
    feature_cost = sum(FEATURE_PRICES.get(f, 0) for f in data.features)

    # Complexity multiplier
    multiplier = COMPLEXITY_MULTIPLIER.get(data.complexity, 1)

    # Rule-based estimated price
    estimated_price = (base_price + feature_cost) * multiplier

    # Convert complexity for AI model
    complexity_map = {
        "low": 1,
        "medium": 2,
        "high": 3
    }

    # AI prediction
    ai_price = predict_price(
        data.project_type,
        len(data.features),
        complexity_map[data.complexity]
    )

    # Timeline calculation
    timeline_days = 5 + len(data.features) * 2

    return {
        "estimated_price": round(estimated_price, 2),
        "recommended_price": ai_price,
        "timeline_days": timeline_days
    }