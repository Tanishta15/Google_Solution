import json

import firebase_admin
from firebase_admin import credentials, storage
from kafka import KafkaProducer

# Initialize Firebase Admin with correct bucket name (NOT URL)
cred = credentials.Certificate(
    r"C:\Users\Pradyu\Desktop\Projects\GSC\solution-4f24a-firebase-adminsdk-fbsvc-751ca90032.json"
)
firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "solution-4f24a.firebasestorage.app"  # Make sure this matches your actual bucket
    },
)

# Set up Kafka producer
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)


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
    producer.close()
    print("All messages sent and producer closed.")


scan_bucket_and_send_to_kafka()
