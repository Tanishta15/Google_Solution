import logging
import os

import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google.cloud import firestore
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

spark = (
    SparkSession.builder.appName("KafkaIntegration")
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.5")
    .getOrCreate()
)

df = (
    spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "my_topic")
    .option("startingOffsets", "earliest")
    .load()
)

df.printSchema()

df = df.selectExpr("CAST(value AS STRING) as content")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Firestore
db = firestore.Client()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Fetch similar content using Google Gemini
def search_similar_content(text):
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(
            f"Find sources or similar articles related to: {text}. Provide URLs if possible."
        )
        return response.text.split("\n")  # Return list of URLs
    except Exception as e:
        logger.error(f"Error fetching similar content: {e}")
        return []


# Extract text from a webpage
def extract_text_from_url(url):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return " ".join([p.text for p in paragraphs])
    except Exception as e:
        logger.error(f"Error extracting text from URL: {e}")
        return ""


# Check similarity using TF-IDF & Cosine Similarity
def check_plagiarism(original_text, web_texts):
    try:
        all_texts = [original_text] + web_texts  # Combine original + fetched texts
        vectorizer = TfidfVectorizer().fit_transform(all_texts)
        similarity_matrix = cosine_similarity(vectorizer)
        similarity_scores = similarity_matrix[0][
            1:
        ]  # Compare original text with others
        return any(score > 0.8 for score in similarity_scores), similarity_scores
    except Exception as e:
        logger.error(f"Error checking plagiarism: {e}")
        return False, []


# Process text content
def process_content(content):
    try:
        # Step 1: Fetch similar content URLs
        matching_links = search_similar_content(content)
        logger.info(f"Fetched similar content URLs: {matching_links}")

        # Step 2: Extract text from these URLs
        web_texts = [
            extract_text_from_url(link)
            for link in matching_links
            if link.startswith("http")
        ]
        logger.info(f"Extracted text from URLs: {web_texts}")

        # Step 3: Check for plagiarism
        flagged, similarity_scores = check_plagiarism(content, web_texts)
        logger.info(
            f"Plagiarism check result: {flagged} | Similarity Scores: {similarity_scores}"
        )

        # Step 4: Store results if flagged
        if flagged:
            doc_ref = db.collection("violations").document()
            doc_ref.set(
                {
                    "content": content,
                    "flagged": flagged,
                    "matching_links": matching_links,
                    "similarity_scores": similarity_scores,
                }
            )
            logger.info(f"Flagged Content Stored in Firestore: {content}")

    except Exception as e:
        logger.error(f"Error processing content: {e}")


# ------------------ 3️⃣ Apply Processing to Kafka Stream (Fixed) ------------------


def foreach_batch_function(batch_df, batch_id):
    contents = batch_df.select("content").collect()  # Convert to Pandas-like format
    for row in contents:
        process_content(row.content)


# Stream Processing (Using `foreachBatch()`)
query = df.writeStream.foreachBatch(foreach_batch_function).start()

query.awaitTermination()
logger.info("Initializing Spark Session...")
spark = (
    SparkSession.builder.appName("ContentMonitoring")
    .config("spark.sql.streaming.checkpointLocation", "/tmp/spark-checkpoints")
    .getOrCreate()
)
logger.info("Spark Session Initialized.")

logger.info("Initializing Kafka Stream...")
df = (
    spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "content-stream")
    .option("startingOffsets", "latest")
    .load()
)
logger.info("Kafka Stream Initialized.")

df = df.selectExpr("CAST(value AS STRING) as content")
logger.info("Kafka Stream Data Selected.")

logger.info("Initializing Google Gemini API...")
genai.configure(api_key="your-google-api-key")
logger.info("Google Gemini API Initialized.")

logger.info("Initializing Firestore...")
db = firestore.Client()
logger.info("Firestore Initialized.")

logger.info("Setting up logging...")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Logging Set Up.")

logger.info("Defining Helper Functions...")


def search_similar_content(text):
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(
            f"Find sources or similar articles related to: {text}. Provide URLs if possible."
        )
        return response.text.split("\n")  # Return list of URLs
    except Exception as e:
        logger.error(f"Error fetching similar content: {e}")
        return []


def extract_text_from_url(url):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return " ".join([p.text for p in paragraphs])
    except Exception as e:
        logger.error(f"Error extracting text from URL: {e}")
        return ""


def check_plagiarism(original_text, web_texts):
    try:
        all_texts = [original_text] + web_texts  # Combine original + fetched texts
        vectorizer = TfidfVectorizer().fit_transform(all_texts)
        similarity_matrix = cosine_similarity(vectorizer)
        similarity_scores = similarity_matrix[0][
            1:
        ]  # Compare original text with others
        return any(score > 0.8 for score in similarity_scores), similarity_scores
    except Exception as e:
        logger.error(f"Error checking plagiarism: {e}")
        return False, []


def process_content(content):
    try:
        logger.info(f"Processing Content: {content}")
        # Step 1: Fetch similar content URLs
        matching_links = search_similar_content(content)
        logger.info(f"Fetched similar content URLs: {matching_links}")

        # Step 2: Extract text from these URLs
        web_texts = [
            extract_text_from_url(link)
            for link in matching_links
            if link.startswith("http")
        ]
        logger.info(f"Extracted text from URLs: {web_texts}")

        # Step 3: Check for plagiarism
        flagged, similarity_scores = check_plagiarism(content, web_texts)
        logger.info(
            f"Plagiarism check result: {flagged} | Similarity Scores: {similarity_scores}"
        )

        # Step 4: Store results if flagged
        if flagged:
            doc_ref = db.collection("violations").document()
            doc_ref.set(
                {
                    "content": content,
                    "flagged": flagged,
                    "matching_links": matching_links,
                    "similarity_scores": similarity_scores,
                }
            )
            logger.info(f"Flagged Content Stored in Firestore: {content}")
    except Exception as e:
        logger.error(f"Error processing content: {e}")


logger.info("Defining Foreach Batch Function...")


def foreach_batch_function(batch_df, batch_id):
    logger.info(f"Processing Batch {batch_id}...")
    contents = batch_df.select("content").collect()  # Convert to Pandas-like format
    for row in contents:
        process_content(row.content)
    logger.info(f"Batch {batch_id} Processed.")


logger.info("Starting Stream Processing...")
query = df.writeStream.foreachBatch(foreach_batch_function).start()
logger.info("Stream Processing Started.")

query.awaitTermination()
