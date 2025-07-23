
const db = require('./db');

async function processSale(product_id, quantity) {
  const result = await db.query(
    'SELECT * FROM inventory_batches WHERE product_id = $1 AND quantity > 0 ORDER BY timestamp ASC',
    [product_id]
  );

  let remaining = quantity;
  let totalCost = 0;

  for (const batch of result.rows) {
    const qtyToUse = Math.min(remaining, batch.quantity);
    totalCost += qtyToUse * batch.unit_price;
    await db.query(
      'UPDATE inventory_batches SET quantity = quantity - $1 WHERE id = $2',
      [qtyToUse, batch.id]
    );
    remaining -= qtyToUse;
    if (remaining <= 0) break;
  }

  const avgCost = totalCost / quantity;
  await db.query(
    'INSERT INTO sales (product_id, quantity, total_cost, cost_per_unit) VALUES ($1, $2, $3, $4)',
    [product_id, quantity, totalCost, avgCost]
  );

  return { product_id, quantity, totalCost, avgCost };
}

module.exports = { processSale };
