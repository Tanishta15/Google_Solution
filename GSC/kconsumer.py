import json
import os

import google.generativeai as genai
from dotenv import load_dotenv
from google.cloud import language_v1, storage, vision
from google.oauth2 import service_account
from kafka import KafkaConsumer

from firebase_config import db

FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

# Path to your service account key
KEY_PATH = rf"{FIREBASE_CREDENTIALS}"

# Load credentials
credentials = service_account.Credentials.from_service_account_file(KEY_PATH)

# Initialize Google Cloud clients
vision_client = vision.ImageAnnotatorClient(credentials=credentials)
language_client = language_v1.LanguageServiceClient(credentials=credentials)
storage_client = storage.Client(credentials=credentials)

# Set Gemini API key
os.environ["GOOGLE_API_KEY"] = "enter gemini api key"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])


def read_text_from_gcs(bucket_name, file_name):
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    return blob.download_as_text()


def interpret_sentiment(score):
    if score >= 0.6:
        return "Very Positive"
    elif score >= 0.2:
        return "Positive"
    elif score > -0.2:
        return "Neutral"
    elif score > -0.6:
        return "Negative"
    else:
        return "Very Negative"


def scan_image(file_path):
    image = vision.Image()
    image.source.image_uri = file_path

    response = vision_client.safe_search_detection(image=image)
    annotations = response.safe_search_annotation

    return {
        "adult": annotations.adult.name,
        "spoof": annotations.spoof.name,
        "medical": annotations.medical.name,
        "violence": annotations.violence.name,
        "racy": annotations.racy.name,
    }


def scan_text(text):
    document = language_v1.Document(
        content=text, type_=language_v1.Document.Type.PLAIN_TEXT
    )
    response = language_client.analyze_sentiment(document=document)
    score = response.document_sentiment.score
    return {"sentiment_score": score, "sentiment_label": interpret_sentiment(score)}


def scan_video(file_path):
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(["Analyze this video:", file_path])
    return {"video_analysis": response.text}


consumer = KafkaConsumer(
    "content_scan",
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda x: json.loads(x.decode("utf-8")),
)

bucket_name = "solution-4f24a.firebasestorage.app"

for msg in consumer:
    file_info = msg.value
    print(f"Received message: {file_info}")
    file_name = file_info["file_name"]

    if file_name.endswith(".txt"):
        text = read_text_from_gcs(bucket_name, file_name)
        result = scan_text(text)

    elif file_name.endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")):
        result = scan_image(f"gs://{bucket_name}/{file_name}")

    elif file_name.endswith(".mp4"):
        result = scan_video(f"gs://{bucket_name}/{file_name}")

    db.collection("scan_results").document(file_name).set(result)
    print(f"Scanned {file_name}: {result}")
