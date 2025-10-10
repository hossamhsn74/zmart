from sqlalchemy import Column, Integer, String, JSON
from .db import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, index=True)
    type = Column(String)  # e.g. 'bought_together', 'popular'
    related_products = Column(JSON)  # list of product_ids
