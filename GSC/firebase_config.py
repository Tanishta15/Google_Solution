import firebase_admin
from firebase_admin import credentials, firestore, storage

# Load Firebase credentials
cred = credentials.Certificate("/Users/tanishta/Desktop/GitHub/solution-4f24a-firebase-adminsdk-fbsvc-8d8a282892.json")  # Use the downloaded key
firebase_admin.initialize_app(cred, {
    'storageBucket': 'solution-4f24a.firebasestorage.app'
})
# Firestore Database
db = firestore.client()

# Firebase Storage
bucket = storage.bucket()