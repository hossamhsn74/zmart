from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..recommender import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{product_id}")
def fetch_recommendations(product_id: str, db: Session = Depends(get_db)):
    """
    Return a list of product IDs that were frequently bought together
    with the given product.
    """
    related = get_recommendations(db, product_id)
    if not related:
        raise HTTPException(status_code=404, detail="No recommendations found")
    return {"product_id": product_id, "related_products": related}
