import json
import os
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, storage
from kafka import KafkaProducer
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS

load_dotenv()

# Initialize Firebase Admin
cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS"))
firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "solution-4f24a.firebasestorage.app"
    },
)

# Initialize Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro-001')

# Set up Kafka producer
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        # Upload to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(file.filename)
        blob.upload_from_file(file)
        
        # Get file content for sentiment analysis
        file.seek(0)  # Reset file pointer to beginning
        content = file.read().decode('utf-8', errors='ignore')
        
        # Perform sentiment analysis using Gemini API
        prompt = f"""
        Analyze the sentiment of the following text and provide a detailed breakdown.
        Return a JSON object with the following structure:
        {{
            "sentiment": "positive/negative/neutral",
            "confidence": 0-100,
            "summary": "brief summary",
            "key_phrases": ["phrase1", "phrase2"],
            "emotional_tone": "description of emotional tone"
        }}
        
        Text to analyze: {content[:4000]}  # Limiting to first 4000 chars for API limits
        """
        
        response = model.generate_content(prompt)
        sentiment_result = response.text
        
        # Try to extract JSON from response
        try:
            # Find JSON content between triple backticks if present
            import re
            json_match = re.search(r'```json\s*(.*?)\s*```', sentiment_result, re.DOTALL)
            if json_match:
                sentiment_json = json.loads(json_match.group(1))
            else:
                # Try to parse the whole response as JSON
                sentiment_json = json.loads(sentiment_result)
        except:
            # Fallback if parsing fails
            sentiment_json = {
                "sentiment": "unknown",
                "confidence": 0,
                "summary": "Could not analyze sentiment accurately",
                "key_phrases": [],
                "emotional_tone": "unknown"
            }
            
        # Send message to Kafka for async processing
        message = {
            "file_name": file.filename,
            "sentiment": sentiment_json
        }
        producer.send("content_scan", message)
        
        return jsonify({
            "success": True,
            "message": "File uploaded and analyzed",
            "filename": file.filename,
            "sentiment_analysis": sentiment_json
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
