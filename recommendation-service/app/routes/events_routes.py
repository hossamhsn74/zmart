from fastapi import APIRouter, HTTPException, Request
import jsonschema
import json
import uuid
import datetime
import os
from aiokafka import AIOKafkaProducer
from ..event_schemas import product_viewed

router = APIRouter(prefix="/events", tags=["Events"])

schemas = {"product_viewed": product_viewed.schema}
bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")


async def get_producer():
    producer = AIOKafkaProducer(
        bootstrap_servers=bootstrap,
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )
    await producer.start()
    return producer


@router.post("/")
async def ingest_event(request: Request):
    body = await request.json()
    events = body if isinstance(body, list) else [body]
    sent = []
    producer = await get_producer()
    try:
        for ev in events:
            event_type = ev.get("type")
            schema = schemas.get(event_type)
            if not schema:
                raise HTTPException(400, f"Unknown event type '{event_type}'")
            try:
                jsonschema.validate(ev, schema)
            except jsonschema.ValidationError as e:
                raise HTTPException(400, f"Invalid event payload: {e.message}")

            ev.setdefault("event_id", str(uuid.uuid4()))
            ev.setdefault("ts", datetime.datetime.utcnow().isoformat())

            topic = f"events.{event_type}"
            await producer.send_and_wait(topic, ev)
            sent.append(topic)
        return {"status": "ok", "events_sent": sent}
    finally:
        await producer.stop()
