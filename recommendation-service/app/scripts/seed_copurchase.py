#!/usr/bin/env python3
"""
Seed Elasticsearch 'copurchase' index for local demo of FBT.
"""
import asyncio
from datetime import datetime
from elasticsearch import AsyncElasticsearch

ES_URL = "http://localhost:9200"
ES_USER = "elastic"
ES_PASS = "changeme"

sample_docs = [
    {
        "product_id": "A100",
        "updated_at": datetime.utcnow().isoformat(),
        "related": [
            {
                "related_product_id": "B200",
                "support": 0.05,
                "confidence": 0.40,
                "lift": 2.1,
                "score": 1.25,
            },
            {
                "related_product_id": "C300",
                "support": 0.03,
                "confidence": 0.33,
                "lift": 1.8,
                "score": 1.05,
            },
        ],
    },
    {
        "product_id": "B200",
        "updated_at": datetime.utcnow().isoformat(),
        "related": [
            {
                "related_product_id": "A100",
                "support": 0.05,
                "confidence": 0.45,
                "lift": 2.3,
                "score": 1.32,
            },
            {
                "related_product_id": "C300",
                "support": 0.04,
                "confidence": 0.30,
                "lift": 1.7,
                "score": 0.95,
            },
        ],
    },
]


async def main():
    es = AsyncElasticsearch(
        hosts=[ES_URL], basic_auth=(ES_USER, ES_PASS), verify_certs=False
    )
    for doc in sample_docs:
        await es.index(index="copurchase", id=doc["product_id"], document=doc)
        print(f"✅ Seeded copurchase for {doc['product_id']}")
    await es.close()


if __name__ == "__main__":
    asyncio.run(main())
