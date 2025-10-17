from .elasticsearch_client import es


async def create_templates():
    template = {
        "index_patterns": ["events-*"],
        "template": {
            "settings": {
                "index.lifecycle.name": "events-ilm-policy",
                "index.lifecycle.rollover_alias": "events",
            },
            "mappings": {
                "properties": {
                    "event_id": {"type": "keyword"},
                    "user_id": {"type": "keyword"},
                    "session_id": {"type": "keyword"},
                    "event_type": {"type": "keyword"},
                    "products": {"type": "keyword"},
                    "total": {"type": "float"},
                    "ts": {"type": "date"},
                }
            },
        },
    }
    await es.indices.put_index_template(name="events-template", body=template)
