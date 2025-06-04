# Use Python slim image
FROM python:3.11-slim

# Install MySQL dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Corrected line
COPY .env.production .env

# Copy source code
COPY django_project/ ./django_project/
COPY my_apps/ ./my_apps/
COPY manage.py .

# Expose port
EXPOSE 8000

# Run app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "--settings=django_project.settings"]
