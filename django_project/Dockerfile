# Use Python slim image
FROM python:3.11-slim

# Install MySQL dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project files and custom apps
COPY django_project/ ./django_project/
COPY my_apps/ ./my_apps/
COPY manage.py ./

# Use runtime env vars from Azure, not .env file

# Expose Django port
EXPOSE 8000

# Start Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "--settings=django_project.settings"]
