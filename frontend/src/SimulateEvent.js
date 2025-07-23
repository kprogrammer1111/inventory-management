import React, { useState } from 'react';
import axios from 'axios';

function SimulateEvent({ onEventSent }) {
  const [type, setType] = useState('purchase');
  const [productId, setProductId] = useState('PRD001');
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendEvent = async () => {
    setLoading(true);
    setMessage('');
    const event = {
      product_id: productId,
      event_type: type,
      quantity: Number(quantity),
      timestamp: new Date().toISOString()
    };
    if (type === 'purchase') event.unit_price = Number(unitPrice);

    try {
      await axios.post('http://localhost:3000/api/simulate-event', event);
      setMessage('✅ Event sent!');
      if (onEventSent) onEventSent();
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginBottom: 24,
      padding: 20,
      border: '1px solid #1976d2',
      borderRadius: 8,
      background: '#f5faff',
      maxWidth: 400
    }}>
      <h3 style={{ color: '#1976d2', marginTop: 0 }}>Simulate Kafka Event</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Product ID:</label>
        <input value={productId} onChange={e => setProductId(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Event Type:</label>
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}>
          <option value="purchase">Purchase</option>
          <option value="sale">Sale</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Quantity:</label>
        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
      </div>
      {type === 'purchase' && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Unit Price:</label>
          <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
      )}
      <button onClick={sendEvent} disabled={loading} style={{
        background: '#1976d2', color: '#fff', padding: '8px 20px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600
      }}>
        {loading ? 'Sending...' : 'Send Event'}
      </button>
      {message && <div style={{ marginTop: 12, fontWeight: 500 }}>{message}</div>}
    </div>
  );
}

export default SimulateEvent; 