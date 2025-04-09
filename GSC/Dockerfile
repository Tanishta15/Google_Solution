# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    default-jre-headless && \
    apt-get clean

# Install uv
RUN pip install uv

# Install Python dependencies using uv
COPY pyproject.toml .
RUN uv pip install -r pyproject.toml --system

# Download and set up Kafka and Zookeeper
RUN wget https://downloads.apache.org/kafka/3.7.2/kafka_2.12-3.7.2.tgz && \
    tar -xzf kafka_2.12-3.7.2.tgz && \
    mv kafka_2.12-3.7.2 /opt/kafka && \
    rm kafka_2.12-3.7.2.tgz

# Copy application code
COPY . .

# Expose necessary ports
EXPOSE 8080 9092 2181

# Start Zookeeper, Kafka, and the Python scripts
CMD ["sh", "-c", "\
    /opt/kafka/bin/zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties & \
    sleep 5 && \
    /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties & \
    sleep 10 && \
    python kconsumer.py & \
    python kproducer.py \
"]
