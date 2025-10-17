# app/elasticsearch_client.py
from elasticsearch import AsyncElasticsearch
import os

ES_URL = os.getenv("ELASTICSEARCH_URL", "http://elasticsearch:9200")
ES_USER = os.getenv("ELASTIC_USER", "elastic")
ES_PASS = os.getenv("ELASTIC_PASS", "changeme")

es = AsyncElasticsearch(
    hosts=[ES_URL], basic_auth=(ES_USER, ES_PASS), verify_certs=False
)
