from kafka import KafkaConsumer
import json
from google.cloud import vision, language_v1, storage
import google.generativeai as genai
import os
from firebase_config import db

consumer = KafkaConsumer(
    'content_scan',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

os.environ["GOOGLE_API_KEY"] = "AIzaSyDkXnTIKq6WNJscymGaWr9avzuD5p22DxA"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

def scan_image(file_path):
    """Scan images using Google Vision API"""
    client = vision.ImageAnnotatorClient()
    image = vision.Image()
    image.source.image_uri = file_path

    response = client.safe_search_detection(image=image)
    annotations = response.safe_search_annotation

    return {
        "adult": annotations.adult,
        "violence": annotations.violence,
        "racy": annotations.racy
    }

def scan_text(text):
    """Analyze text using Google NLP API"""
    client = language_v1.LanguageServiceClient()
    document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)

    response = client.analyze_sentiment(document=document)
    return {"sentiment": response.document_sentiment.score}

def scan_video(file_path):
    """Analyze video content using Gemini API"""
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(["Analyze this video:", file_path])
    return response.text

# Process files from Kafka
for msg in consumer:
    file_info = msg.value
    file_name = file_info['file_name']
    
    if file_name.endswith('.txt'):
        with open(file_name, 'r') as f:
            text = f.read()
        result = scan_text(text)
    
    elif file_name.endswith(('.jpg', '.png')):
        result = scan_image(f"gs://your-bucket-name/{file_name}")

    elif file_name.endswith('.mp4'):
        result = scan_video(f"gs://your-bucket-name/{file_name}")

    # Store results in Firestore
    db.collection('scan_results').document(file_name).set(result)
    print(f"Scanned {file_name}: {result}")
    