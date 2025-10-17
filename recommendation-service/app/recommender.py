from sqlalchemy.orm import Session
from .models import Recommendation


def update_bought_together(db: Session, order_items: list[str]):
    for pid in order_items:
        related = [p for p in order_items if p != pid]
        rec = (
            db.query(Recommendation)
            .filter_by(product_id=pid, type="bought_together")
            .first()
        )
        if rec:
            existing = set(rec.related_products or [])
            rec.related_products = list(existing.union(related))
        else:
            rec = Recommendation(
                product_id=pid,
                type="bought_together",
                related_products=related,
            )
            db.add(rec)
    db.commit()


def get_recommendations(db: Session, product_id: str):
    rec = (
        db.query(Recommendation)
        .filter_by(product_id=product_id, type="bought_together")
        .first()
    )
    return rec.related_products if rec else []
