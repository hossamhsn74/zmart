schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "ProductViewedEvent",
    "type": "object",
    "properties": {
        "type": {"type": "string"},
        "event_id": {"type": "string"},
        "user_id": {"type": ["string", "null"]},
        "session_id": {"type": "string"},
        "product_id": {"type": "string"},
        "ts": {"type": "string", "format": "date-time"},
        "source": {"type": "string", "enum": ["web", "email", "push"]},
        "ab_variant": {"type": ["string", "null"], "enum": ["A", "B", "None", None]},
    },
    "required": ["type", "session_id", "product_id", "ts", "source"],
}
