# Use slim Python base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install required system packages (curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Create a non-root user
RUN adduser --disabled-password --gecos "" --uid 1001 appuser \
    && chown -R appuser /app
USER appuser

# Expose FastAPI/Gunicorn port
EXPOSE 8001

# Healthcheck using curl
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD curl -f http://localhost:8001/healthz || exit 1

# Start with Gunicorn + Uvicorn worker
# ⚠️ Adjust the module path "recommender.main:app" if your code lives elsewhere
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
