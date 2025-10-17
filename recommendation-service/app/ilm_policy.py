from .elasticsearch_client import es


async def create_ilm_policy():
    policy = {
        "policy": {
            "phases": {
                "hot": {"actions": {"rollover": {"max_age": "1d", "max_size": "50gb"}}},
                "delete": {"min_age": "30d", "actions": {"delete": {}}},
            }
        }
    }
    await es.ilm.put_lifecycle(name="events-ilm-policy", policy=policy["policy"])
