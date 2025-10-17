from aiokafka import AIOKafkaConsumer
import json, itertools, os, asyncio, redis

r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), decode_responses=True)


def pairs(product_ids: list[str]) -> set[tuple[str, str]]:
    uniq = sorted(set(product_ids))
    return {(a, b) for a, b in itertools.combinations(uniq, 2)}


async def stream_fbt():
    consumer = AIOKafkaConsumer(
        os.getenv("K_TOPIC_ORDER", "order.completed"),
        os.getenv("K_TOPIC_CART", "cart_events"),
        bootstrap_servers=os.getenv("K_BOOTSTRAP", "kafka:9092"),
        group_id="fbt-stream",
        value_deserializer=lambda v: json.loads(v.decode()),
        enable_auto_commit=True,
    )
    await consumer.start()
    try:
        async for msg in consumer:
            items = msg.value.get("items") or []
            pids = [i["product_id"] for i in items if "product_id" in i]
            for a, b in pairs(pids):
                # symmetric counters
                r.hincrby(f"fbt:{a}", b, 1)
                r.hincrby(f"fbt:{b}", a, 1)
                # item counts for support/confidence
                r.incr(f"count:{a}")
                r.incr(f"count:{b}")
    finally:
        await consumer.stop()
