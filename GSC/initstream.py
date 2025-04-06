import time

from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="localhost:9092", api_version=(4, 0, 0)  # Match Kafka version
)
contents = [
    "Artificial Intelligence is transforming the world.",
    "The stock market fluctuates due to various economic factors.",
    "Climate change is a pressing issue that needs immediate attention.",
]
for content in contents:
    producer.send("content-stream", content.encode("utf-8"))
    print(f"Sent: {content}")
    time.sleep(5)  # Simulating real-time data
