from kafka import KafkaProducer
import json
import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate("/Users/tanishta/Desktop/GitHub/solution-4f24a-firebase-adminsdk-fbsvc-8d8a282892.json")  
firebase_admin.initialize_app(cred, {"storageBucket": "solution-4f24a.appspot.com"})

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def get_uploaded_files():
    bucket = storage.bucket()  # Access Firebase Storage
    blobs = bucket.list_blobs()  # List all files
    for blob in blobs:
        print(blob.name)

get_uploaded_files()
