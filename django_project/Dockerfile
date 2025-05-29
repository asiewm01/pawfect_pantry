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

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project and apps
COPY django_project/ ./django_project/
COPY my_apps/ ./my_apps/
COPY manage.py ./

# Optional: collect static files if needed
# RUN python manage.py collectstatic --noinput --settings=django_project.settings

# Expose Django app port
EXPOSE 8000

# Use Gunicorn to serve in production
CMD ["gunicorn", "django_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "4"]
