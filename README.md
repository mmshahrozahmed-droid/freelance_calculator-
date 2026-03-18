# 💼 Freelance Price Calculator (AI-Powered)

An intelligent web application that calculates freelance project pricing using both **rule-based logic** and a **machine learning model**.

This project is built as a full-stack system with:

* ⚛️ Frontend: React
* ⚡ Backend: FastAPI
* 🧠 AI Model: Linear Regression (Scikit-learn)

---

## 🚀 Features

* 📊 Calculate project price based on:

  * Project Type (Website, AI, Automation)
  * Selected Features
  * Complexity Level
* 🧠 AI-powered price recommendation
* ⚡ Fast API response
* 🎨 Clean and modern UI
* 🌐 Ready for deployment

---

## 🧠 How It Works

1. User selects project details from frontend
2. React sends data to FastAPI backend
3. Backend:

   * Calculates rule-based price
   * Sends data to ML model
4. ML model predicts recommended price
5. Result is returned and displayed

---

## 🏗️ Project Structure

```
freelance-price-calculator/
│
├── backend/
│   ├── main.py
│   ├── ai_module.py
│   ├── data.csv
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   ├── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS

### Backend

* FastAPI
* Pydantic
* Uvicorn

### AI / ML

* Pandas
* Scikit-learn (Linear Regression)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/freelance-price-calculator.git
cd freelance-price-calculator
```

---

## ▶️ Backend Setup (FastAPI)

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Open:

```
http://localhost:8000/docs
```

---

## ▶️ Frontend Setup (React)

```
cd frontend
npm install
npm start
```

Open:

```
http://localhost:3000
```

---

## 🔌 API Endpoint

### POST `/calculate-price`

#### Request:

```json
{
  "project_type": "website",
  "features": ["admin_panel", "payment"],
  "complexity": "medium"
}
```

#### Response:

```json
{
  "estimated_price": 720,
  "recommended_price": 800,
  "timeline_days": 9
}
```

---

## 🧠 Machine Learning Model

* Algorithm: Linear Regression
* Type: Supervised Learning
* Input Features:

  * Project Type (encoded)
  * Feature Count
  * Complexity Level
* Output:

  * Predicted Price

The model is trained using historical project data stored in `data.csv`.

---

## 🌐 Deployment

### Backend:

* Render

### Frontend:

* Vercel

---

## 🎓 Academic Value

This project demonstrates:

* Full-stack development
* API design with FastAPI
* Machine learning integration
* Real-world problem solving

---

## 📌 Future Improvements

* 📈 Advanced ML model (Random Forest / XGBoost)
* 💾 Database integration
* 📊 Analytics dashboard
* 🔐 User authentication
* 🌍 Multi-currency support

---

## 👨‍💻 Author

**Shahroz Ahmed**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
