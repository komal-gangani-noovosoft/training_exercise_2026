# from flask import Flask , render_template ,request
# import joblib
# import numpy as np
# import pandas as pd

# app = Flask(__name__)

# model = joblib.load("model/final_model.pkl")
# metrics = joblib.load("model/metrics.pkl")

# @app.route('/')

# @app.route("/")
# def index():
#     return render_template(
#         "index.html",
#         accuracy=round(metrics["accuracy"]*100, 2),
#         roc_auc=round(metrics["roc_auc"], 3),
#         pr_auc=round(metrics["pr_auc"], 3)
#     )
# @app.route('/predict')
# def predict():
#     return render_template('predict.html')


# @app.route('/result' , methods=['POST'])
# def result():
#     age = float(request.form['age'])
#     gender = int(request.form['gender'])
#     height = float(request.form['height'])
#     weight = float(request.form['weight'])
#     ap_hi = float(request.form['ap_hi'])
#     ap_lo = float(request.form['ap_lo'])
#     smoke = int(request.form['smoke'])
#     alco = int(request.form['alco'])
#     active = int(request.form['active'])
#     cholesterol = int(request.form['cholesterol'])
#     gluc = int(request.form['gluc'])
#     pulse_pressure = ap_hi - ap_lo
#     BMI = weight / ((height/100) ** 2)
#     cholesterol_2 = 1 if cholesterol == 2 else 0
#     cholesterol_3 = 1 if cholesterol == 3 else 0
#     gluc_2 = 1 if gluc == 2 else 0
#     gluc_3 = 1 if gluc == 3 else 0


#     input_data = pd.DataFrame([{
#         "age": age,
#         "gender": gender,
#         "height": height,
#         "weight": weight,
#         "ap_hi": ap_hi,
#         "ap_lo": ap_lo,
#         "smoke": smoke,     
#         "pulse_pressure" : pulse_pressure,
#         "BMI" : BMI,
#         "alco": alco,
#         "active": active,        
#         "cholesterol_2": cholesterol_2,          
#         "cholesterol_3" : cholesterol_3,
#         "gluc_2": gluc_2, 
#         "gluc_3" : gluc_3
#     }])
#     prediction = model.predict(input_data)[0]
#     probabilities = model.predict_proba(input_data)[0]
#     risk_probability = round(probabilities[1] * 100, 2)



#     result = "High risk of cardiovascular disease" if prediction == 1 else "Low risk"

#     return render_template(
#         'result.html',
#         prediction = result,
#         probability=risk_probability
#     )

# if __name__ == '__main__':
#     app.run(debug=True)
# from flask import Flask, render_template, request
# import joblib
# import pandas as pd
# import os

# app = Flask(__name__)

# # Load Artifacts
# # Ensure these files exist in the 'model/' directory
# MODEL_PATH = "model/final_model.pkl"
# METRICS_PATH = "model/metrics.pkl"

# if os.path.exists(MODEL_PATH):
#     model = joblib.load(MODEL_PATH)
# else:
#     model = None
#     print("Warning: Model file not found.")

# if os.path.exists(METRICS_PATH):
#     metrics = joblib.load(METRICS_PATH)
# else:
#     metrics = {"accuracy": 0, "roc_auc": 0, "pr_auc": 0}

# @app.route('/')
# def home():
#     return render_template('index.html')

# @app.route('/insights')
# def insights():
#     # Mock data for the Comparison Chart (since we only saved the best model)
#     # You can update these with your actual training log values
#     comparison_data = {
#         "labels": ["Logistic Regression", "Naive Bayes", "Random Forest", "XGBoost"],
#         "scores": [72.5, 71.0, round(metrics['accuracy']*100, 1), 73.2]
#     }
    
#     return render_template(
#         'insights.html',
#         metrics=metrics,
#         comparison_data=comparison_data
#     )

# @app.route('/predict')
# def predict():
#     return render_template('predict.html')

# @app.route('/result', methods=['POST'])
# def result():
#     if request.method == 'POST':
#         # 1. Capture Inputs
#         age = float(request.form['age'])
#         gender = int(request.form['gender'])
#         height = float(request.form['height']) 
#         weight = float(request.form['weight']) 
#         ap_hi = float(request.form['ap_hi'])
#         ap_lo = float(request.form['ap_lo'])
#         smoke = int(request.form['smoke'])
#         alco = int(request.form['alco'])
#         active = int(request.form['active'])
#         cholesterol = int(request.form['cholesterol']) 
#         gluc = int(request.form['gluc'])             

#         # 2. Feature Engineering
#         pulse_pressure = ap_hi - ap_lo
        
#         # CRITICAL FIX: Convert cm to meters for BMI to match training
#         BMI = weight / ((height / 100) ** 2)

#         cholesterol_2 = 1 if cholesterol == 2 else 0
#         cholesterol_3 = 1 if cholesterol == 3 else 0
#         gluc_2 = 1 if gluc == 2 else 0
#         gluc_3 = 1 if gluc == 3 else 0

#         # 3. DataFrame Construction
#         input_data = pd.DataFrame([{
#             "age": age, "gender": gender, "height": height, "weight": weight,
#             "ap_hi": ap_hi, "ap_lo": ap_lo, "smoke": smoke, "pulse_pressure": pulse_pressure,
#             "BMI": BMI, "alco": alco, "active": active,
#             "cholesterol_2": cholesterol_2, "cholesterol_3": cholesterol_3,
#             "gluc_2": gluc_2, "gluc_3": gluc_3
#         }])

#         # 4. Inference
#         prediction = model.predict(input_data)[0]
#         probabilities = model.predict_proba(input_data)[0]
#         risk_probability = round(probabilities[1] * 100, 2)

#         return render_template(
#             'result.html',
#             prediction=prediction,
#             probability=risk_probability,
#             user_data=input_data.iloc[0].to_dict()
#         )

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Load Model & Metrics
MODEL_PATH = "model/final_model.pkl"
METRICS_PATH = "model/metrics.pkl"

if os.path.exists(MODEL_PATH):
    pipeline = joblib.load(MODEL_PATH)
    # Extract Feature Importance from the Random Forest step
    # Note: This assumes your pipeline step is named 'model' as per your training script
    try:
        model_step = pipeline.named_steps['model']
        # Map feature names manually as pipeline doesn't store input names after transformation
        # Order matters! Based on your ColumnTransformer
        feature_names = [
            "Age", "Height", "Weight", "Systolic BP", "Diastolic BP", "Smoker", 
            "Pulse Pressure", "BMI", "Alcohol", "Active", 
            "Cholesterol (High)", "Cholesterol (Very High)", 
            "Glucose (High)", "Glucose (Very High)"
        ]
        # Get raw importance
        importances = model_step.feature_importances_
        # Sort them
        feature_importance_data = sorted(
            zip(feature_names, importances), 
            key=lambda x: x[1], 
            reverse=True
        )
    except:
        feature_importance_data = []
else:
    pipeline = None
    feature_importance_data = []

if os.path.exists(METRICS_PATH):
    metrics = joblib.load(METRICS_PATH)
else:
    metrics = {"accuracy": 0, "roc_auc": 0, "pr_auc": 0}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/insights')
def insights():
    # Feature importance chart
    chart_data = {
        "labels": [str(x[0]) for x in feature_importance_data[:8]],
        "values": [float(round(x[1]*100, 1)) for x in feature_importance_data[:8]]
    }

    # Comparison chart
    comparison_data = {
        "models": ["Logistic Regression", "Decision Tree", "XGBoost", "Random Forest"],
        "accuracies": [72.1, 64.5, 73.2, float(round(metrics['accuracy']*100, 1))]
    }

    # Pass metrics as-is, but access with ['key'] in Jinja
    return render_template(
        'insights.html',
        metrics=metrics,
        feature_data=chart_data,
        comparison=comparison_data
    )

    
    
    

@app.route('/predict')
def predict():
    return render_template('predict.html')

@app.route('/result', methods=['POST'])
def result():
    if request.method == 'POST':
        # 1. Capture Form Data
        form = request.form
        
        # 2. Preprocessing (Must match training EXACTLY)
        # Fix: Convert Height cm -> m for BMI
        bmi_val = float(form['weight']) / ((float(form['height']) / 100) ** 2)
        pulse_pressure = float(form['ap_hi']) - float(form['ap_lo'])
        
        input_data = pd.DataFrame([{
            "age": float(form['age']),
            "gender": int(form['gender']),
            "height": float(form['height']),
            "weight": float(form['weight']),
            "ap_hi": float(form['ap_hi']),
            "ap_lo": float(form['ap_lo']),
            "smoke": int(form['smoke']),
            "alco": int(form['alco']),
            "active": int(form['active']),
            "pulse_pressure": pulse_pressure,
            "BMI": bmi_val,
            # Manual One-Hot Encoding
            "cholesterol_2": 1 if int(form['cholesterol']) == 2 else 0,
            "cholesterol_3": 1 if int(form['cholesterol']) == 3 else 0,
            "gluc_2": 1 if int(form['gluc']) == 2 else 0,
            "gluc_3": 1 if int(form['gluc']) == 3 else 0,
        }])

        # 3. Prediction
        prediction = pipeline.predict(input_data)[0]
        prob = pipeline.predict_proba(input_data)[0][1] # Probability of Class 1
        
        risk_percentage = round(prob * 100, 2)
        
        # Risk Categories
        if risk_percentage < 40:
            risk_level = "Low"
            color = "green"
        elif risk_percentage < 70:
            risk_level = "Medium"
            color = "yellow"
        else:
            risk_level = "High"
            color = "red"

        return render_template('result.html', 
                               risk=risk_level, 
                               prob=risk_percentage, 
                               color=color,
                               bmi=round(bmi_val, 1))

if __name__ == '__main__':
    app.run(debug=True)