FROM python:3.11-slim

# Install MySQL build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose Django default port
EXPOSE 8000

# Run Django app directly (no wait-for-it)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
