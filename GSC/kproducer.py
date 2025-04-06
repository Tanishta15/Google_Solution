import json
import os
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, storage
from kafka import KafkaProducer
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS"))
firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "solution-4f24a.firebasestorage.app"
    },
)

# Set up Kafka producer
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

app = Flask(__name__)

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
        
        # Send message to Kafka
        producer.send("content_scan", {"file_name": file.filename})
        
        return jsonify({
            "success": True,
            "message": "File uploaded and sent to processing queue",
            "filename": file.filename
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Scan Firebase bucket and send each file name to Kafka
def scan_bucket_and_send_to_kafka():
    bucket = storage.bucket()
    blobs = bucket.list_blobs()

    print("Scanning bucket and sending files to Kafka...")
    for blob in blobs:
        file_name = blob.name
        producer.send("content_scan", {"file_name": file_name})
        print(f"Sent to Kafka: {file_name}")

    producer.flush()
    print("All messages sent.")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
