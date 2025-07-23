
# Sample User Cases

1. Purchase Product
- Event: { "product_id": "PRD001", "event_type": "purchase", "quantity": 100, "unit_price": 10, "timestamp": "2025-07-12T10:00:00Z" }

2. Sale Product
- Event: { "product_id": "PRD001", "event_type": "sale", "quantity": 20, "timestamp": "2025-07-12T12:00:00Z" }

Expected:
- FIFO: 20 units sold at $10 = $200 cost
- Remaining inventory: 80 units

3. Another Purchase
- Event: { "product_id": "PRD001", "event_type": "purchase", "quantity": 50, "unit_price": 12, "timestamp": "2025-07-13T09:00:00Z" }

4. Another Sale
- Event: { "product_id": "PRD001", "event_type": "sale", "quantity": 90, "timestamp": "2025-07-14T09:00:00Z" }

Expected:
- 80 units at $10, 10 units at $12
- Total cost = $960 + $120 = $1080
