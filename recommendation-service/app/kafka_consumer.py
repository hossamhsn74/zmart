import asyncio
import json
from aiokafka import AIOKafkaConsumer
from sqlalchemy.orm import Session
from .db import SessionLocal
from .recommender import update_bought_together
import os
from dotenv import load_dotenv

load_dotenv()


async def consume_order_events():
    """
    Asynchronous Kafka consumer that listens for order completion events
    and updates product co-purchase relationships.
    """
    topic = os.getenv("KAFKA_TOPIC_ORDER_COMPLETED", "order.completed")
    bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092"),
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

            product_ids = [item["product_id"] for item in order_items]
            db: Session = SessionLocal()
            try:
                update_bought_together(db, product_ids)
            except Exception as e:
                print(f"❌ Error processing event: {e}")
            finally:
                db.close()
    finally:
        await consumer.stop()
        print("🛑 Kafka consumer stopped.")


async def start_kafka_loop():
    """
    Start the Kafka consumer in a long-running background coroutine.
    This function is meant to be scheduled with asyncio.create_task().
    """
    while True:
        try:
            await consume_order_events()
        except Exception as e:
            print(f"⚠️ Kafka consumer crashed: {e}. Restarting in 5s...")
            await asyncio.sleep(5)
