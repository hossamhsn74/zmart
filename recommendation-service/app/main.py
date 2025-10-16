from fastapi import FastAPI
from app.db import Base, engine
from app.routes import recommendation_routes
from app.kafka_consumer import start_kafka_loop
import asyncio
from contextlib import asynccontextmanager

# Create DB tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context:
    - Starts Kafka consumer on startup.
    - Gracefully cancels it on shutdown.
    """
    print("🚀 Starting Kafka consumer background task...")
    task = asyncio.create_task(start_kafka_loop())
    try:
        yield
    finally:
        print("🛑 Shutting down Kafka consumer...")
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            print("✅ Kafka consumer task cancelled cleanly.")


app = FastAPI(title="Recommendation Service", lifespan=lifespan)

# Routes
app.include_router(recommendation_routes.router)


@app.get("/health")
def root():
    return {"message": "Recommendation Service Running ✅"}
