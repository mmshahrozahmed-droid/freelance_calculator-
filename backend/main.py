
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


from ai_module import predict_price

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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



class ProjectInput(BaseModel):
    project_type: str
    features: List[str]
    complexity: str




@app.post("/calculate-price")
def calculate_price(data: ProjectInput):

    
    base_price = BASE_PRICES.get(data.project_type, 0)

    feature_cost = sum(FEATURE_PRICES.get(f, 0) for f in data.features)

    
    multiplier = COMPLEXITY_MULTIPLIER.get(data.complexity, 1)

    
    estimated_price = (base_price + feature_cost) * multiplier

    complexity_map = {
        "low": 1,
        "medium": 2,
        "high": 3
    }

    
    ai_price = predict_price(
        data.project_type,
        len(data.features),
        complexity_map[data.complexity]
    )

    
    timeline_days = 5 + len(data.features) * 2

    return {
        "estimated_price": round(estimated_price, 2),
        "recommended_price": ai_price,
        "timeline_days": timeline_days
    }