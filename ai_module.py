import pandas as pd
from sklearn.linear_model import LinearRegression

data = pd.read_csv("data.csv")

data['project_type'] = data['project_type'].map({
    'website': 1,
    'ai': 2,
    'automation': 3
})

X = data[['project_type', 'features_count', 'complexity']]
y = data['price']

model = LinearRegression()
model.fit(X, y)

def predict_price(project_type, features_count, complexity):
    
    mapping = {
        'website': 1,
        'ai': 2,
        'automation': 3
    }

    pt = mapping.get(project_type, 1)

    prediction = model.predict([[pt, features_count, complexity]])

    return round(prediction[0], 2)