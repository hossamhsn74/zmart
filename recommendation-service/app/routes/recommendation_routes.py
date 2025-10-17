from .elasticsearch_client import es
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.recommender import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{product_id}")
def fetch_recommendations(product_id: str, db: Session = Depends(get_db)):
    related = get_recommendations(db, product_id)
    if not related:
        raise HTTPException(status_code=404, detail="No recommendations found")
    return {"product_id": product_id, "related_products": related}


@router.get("/fbt")
async def fbt(
    product_id: str,
    limit: int = 5,
    price_min: float | None = None,
    price_max: float | None = None,
    prefer_margin: bool = False,
):
    # 1) Get related from copurchase
    doc = await es.get(index="copurchase", id=product_id, ignore=[404])
    if not doc or not doc.get("_source"):
        return {"items": []}
    rel = doc["_source"]["related"]

    # 2) Fetch product details for candidates
    ids = [r["related_product_id"] for r in rel][:100]
    if not ids:
        return {"items": []}

    prods = await es.search(
        index="products", size=len(ids), query={"terms": {"product_id": ids}}
    )
    items = {p["_source"]["product_id"]: p["_source"] for p in prods["hits"]["hits"]}

    # 3) Filter & rank
    out = []
    for r in rel:
        pid = r["related_product_id"]
        p = items.get(pid)
        if not p:
            continue
        if p.get("stock", 0) <= 0:
            continue
        price = float(p.get("price", 0))
        if price_min is not None and price < price_min:
            continue
        if price_max is not None and price > price_max:
            continue
        margin = float(p.get("margin", 0.0))
        rank_score = r["score"] + (0.1 * margin if prefer_margin else 0.0)
        out.append(
            {
                "product_id": pid,
                "title": p.get("title"),
                "price": price,
                "brand": p.get("brand"),
                "image_url": p.get("image_url"),
                "score": rank_score,
                "margin": margin,
            }
        )

    # brand diversity (simple cap of 2 per brand)
    cap, seen = 2, {}
    filtered = []
    for item in out:
        b = item.get("brand") or "_"
        if seen.get(b, 0) >= cap:
            continue
        seen[b] = seen.get(b, 0) + 1
        filtered.append(item)

    filtered.sort(key=lambda x: (-x["score"], -x["margin"], x["product_id"]))
    return {"items": filtered[:limit]}


@router.post("/fbt/bundle-price")
async def fbt_bundle_price(product_ids: list[str]):
    if not product_ids:
        return {"total": 0.0}
    res = await es.search(
        index="products",
        size=len(product_ids),
        query={"terms": {"product_id": product_ids}},
    )
    total = sum(float(h["_source"].get("price", 0)) for h in res["hits"]["hits"])
    return {"total": round(total, 2)}
