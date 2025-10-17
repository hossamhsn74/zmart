from fastapi import FastAPI
from app.db import Base, engine
from app.routes import recommendation_routes, events_routes
from app.kafka_consumer import start_kafka_loop
import asyncio
from contextlib import asynccontextmanager
from .ilm_policy import create_ilm_policy
from .index_template import create_templates

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Setting up Elasticsearch indices and ILM policy...")
    try:
        create_ilm_policy()
        create_templates()
        print("✅ Elasticsearch ILM & templates configured.")
    except Exception as e:
        print(f"⚠️ Failed to initialize Elasticsearch: {e}")

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


app = FastAPI(title="Recommendation & Ingestor Service", lifespan=lifespan)

app.include_router(recommendation_routes.router)
app.include_router(events_routes.router)


@app.get("/health")
def health():
    return {"message": "Ingestor + Recommendation Service Running ✅"}
