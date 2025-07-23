
const express = require('express');
const router = express.Router();
const db = require('./db');
const fifo = require('./fifo');
const { Kafka } = require('kafkajs');
const jwt = require('jsonwebtoken');

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Admin@123') {
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected products endpoint
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.product_id, p.name,
        COALESCE(SUM(b.quantity), 0) AS current_quantity,
        COALESCE(SUM(b.quantity * b.unit_price), 0) AS total_inventory_cost,
        CASE WHEN COALESCE(SUM(b.quantity), 0) > 0
          THEN ROUND(SUM(b.quantity * b.unit_price) / SUM(b.quantity), 2)
          ELSE 0 END AS average_cost_per_unit
      FROM products p
      LEFT JOIN inventory_batches b ON p.product_id = b.product_id
      GROUP BY p.product_id, p.name
      ORDER BY p.product_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
router.post('/simulate-event', async (req, res) => {
  const event = req.body;
  try {
    await producer.connect();
    await producer.send({
      topic: 'inventory-events',
      messages: [{ value: JSON.stringify(event) }],
    });
    await producer.disconnect();
    res.json({ status: 'Event sent to Kafka', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send event', details: err.message });
  }
});
// Protected sales endpoint
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM sales ORDER BY timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/test', async (req, res) => {
  console.log("testing...");
  res.json({message: "api running..."});
});
module.exports = router;
