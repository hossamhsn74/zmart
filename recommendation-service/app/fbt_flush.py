# app/fbt_flush.py
from datetime import datetime
from .elasticsearch_client import es
import redis, os

r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), decode_responses=True)


async def flush_fbt_batch(limit=5000):
    # iterate keys like fbt:*
    for key in r.scan_iter(match="fbt:*", count=1000):
        a = key.split("fbt:")[1]
        rel = r.hgetall(key)  # {b: count}
        a_count = int(r.get(f"count:{a}") or 1)
        related_docs = []
        for b, co_count in rel.items():
            co = int(co_count)
            b_count = int(r.get(f"count:{b}") or 1)
            support = co / max(
                1, total_tx()
            )  # optional if you track total transactions
            confidence = co / max(1, a_count)
            lift = confidence / max(1e-9, b_count / max(1, total_tx()))
            score = 0.5 * confidence + 0.5 * min(lift, 5.0)
            related_docs.append(
                {
                    "related_product_id": b,
                    "support": support,
                    "confidence": confidence,
                    "lift": lift,
                    "score": score,
                }
            )
        # keep top N
        related_docs.sort(key=lambda x: x["score"], reverse=True)
        related_docs = related_docs[:50]

        await es.index(
            index="copurchase",
            id=a,
            document={
                "product_id": a,
                "updated_at": datetime.utcnow().isoformat(),
                "related": related_docs,
            },
        )
        # Optionally trim Redis to bound memory
        # r.delete(key)
