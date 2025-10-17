import asyncio
import json
import os
from aiokafka import AIOKafkaConsumer
from sqlalchemy.orm import Session
from datetime import datetime
from .db import SessionLocal
from .recommender import update_bought_together
from .elasticsearch_client import es
from dotenv import load_dotenv

load_dotenv()


async def consume_order_events():
    topic = os.getenv("KAFKA_TOPIC_ORDER_COMPLETED", "order.completed")
    bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=bootstrap,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        group_id="recommendation-group",
        enable_auto_commit=True,
    )

    await consumer.start()
    print(f"✅ Listening for events on topic '{topic}' @ {bootstrap}")

    try:
        async for msg in consumer:
            data = msg.value
            order_items = data.get("items", [])
            if not order_items:
                continue

            # Extract product_ids for recommendations
            product_ids = [item["product_id"] for item in order_items]

            # === (1) Update DB Recommendations ===
            db: Session = SessionLocal()
            try:
                update_bought_together(db, product_ids)
            except Exception as e:
                print(f"❌ Error processing event for DB: {e}")
            finally:
                db.close()

            # === (2) Index Event in Elasticsearch ===
            try:
                index_name = f"events-{datetime.utcnow().strftime('%Y-%m-%d')}"
                event_doc = {
                    "event_id": data.get("order_id"),
                    "user_id": data.get("user_id"),
                    "session_id": data.get("session_id"),
                    "event_type": "order_completed",
                    "products": product_ids,
                    "total": data.get("total"),
                    "ts": data.get("timestamp", datetime.utcnow().isoformat()),
                }

                # PII scrubbing (remove sensitive data if present)
                for field in ["email", "ip_address"]:
                    if field in event_doc:
                        del event_doc[field]

                await es.index(
                    index=index_name, id=event_doc["event_id"], document=event_doc
                )
                print(f"📦 Indexed event {event_doc['event_id']} → {index_name}")

            except Exception as e:
                print(f"⚠️ Error indexing event to Elasticsearch: {e}")

    finally:
        await consumer.stop()
        print("🛑 Kafka consumer stopped.")


async def start_kafka_loop():
    while True:
        try:
            await consume_order_events()
        except Exception as e:
            print(f"⚠️ Kafka consumer crashed: {e}. Restarting in 5s...")
            await asyncio.sleep(5)
