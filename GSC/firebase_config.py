import firebase_admin
from firebase_admin import credentials, firestore, storage

# Load Firebase credentials
cred = credentials.Certificate(r"C:\Users\Pradyu\Desktop\Projects\GSC\solution-4f24a-firebase-adminsdk-fbsvc-751ca90032.json")  # Use the downloaded key
firebase_admin.initialize_app(cred, {
    'storageBucket': 'solution-4f24a.firebasestorage.app'
}) #edited to firebasestorage.app
# Firestore Database
db = firestore.client()

# Firebase Storage
bucket = storage.bucket()