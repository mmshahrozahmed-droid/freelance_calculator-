

import React, { useState } from "react";
import "./App.css";

function App() {
  const [projectType, setProjectType] = useState("website");
  const [features, setFeatures] = useState([]);
  const [complexity, setComplexity] = useState("medium");
  const [result, setResult] = useState(null);

  const handleFeatureChange = (feature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const calculatePrice = async () => {
    try {
      const response = await fetch("http://localhost:8000/calculate-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          project_type: projectType,
          features: features,
          complexity: complexity
        })
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>💼 Freelance Price Calculator</h1>

        <div className="section">
          <label>Project Type</label>
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option value="website">Website</option>
            <option value="ai">AI Tool</option>
            <option value="automation">Automation</option>
          </select>
        </div>

        <div className="section">
          <label>Features</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" onChange={() => handleFeatureChange("admin_panel")} />
              Admin Panel
            </label>

            <label>
              <input type="checkbox" onChange={() => handleFeatureChange("payment")} />
              Payment Gateway
            </label>

            <label>
              <input type="checkbox" onChange={() => handleFeatureChange("seo")} />
              SEO Setup
            </label>
          </div>
        </div>

        <div className="section">
          <label>Complexity</label>
          <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button onClick={calculatePrice} className="btn">
          Calculate Price
        </button>

        {result && (
          <div className="result">
            <h2>📊 Result</h2>
            <p><strong>Estimated:</strong> ${result.estimated_price}</p>
            <p><strong>Recommended:</strong> ${result.recommended_price}</p>
            <p><strong>Timeline:</strong> {result.timeline_days} days</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;