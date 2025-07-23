
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SimulateEvent from './SimulateEvent';

function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [auth, setAuth] = useState({ username: 'admin', password: 'Admin@123' });
  const [token, setToken] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  const fetchSales = async () => {
    const res = await axios.get('http://localhost:3000/api/sales', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSales(res.data);
  };

  useEffect(() => {
    if (loggedIn && token) {
      fetchProducts();
      fetchSales();
    }
  }, [loggedIn, token]);

  const refreshData = () => {
    fetchProducts();
    fetchSales();
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        username: auth.username,
        password: auth.password
      });
      setToken(res.data.token);
      setLoggedIn(true);
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setToken(null);
    setLoggedIn(false);
    setAuth({ username: '', password: '' });
  };

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6f8'
      }}>
        <form onSubmit={login} style={{
          background: '#fff',
          padding: 32,
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          minWidth: 320
        }}>
          <h2 style={{ color: '#1976d2', textAlign: 'center' }}>Login</h2>
          <div style={{ marginBottom: 16 }}>
            <label>Username:</label>
            <input
              type="text"
              value={auth.username}
              onChange={e => setAuth({ ...auth, username: e.target.value })}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Password:</label>
            <input
              type="password"
              value={auth.password}
              onChange={e => setAuth({ ...auth, password: e.target.value })}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{
            width: '100%',
            background: '#1976d2',
            color: '#fff',
            padding: '10px 0',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#1976d2', marginBottom: 0 }}>Inventory Management Dashboard</h1>
          <button onClick={logout} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
        </div>
        <SimulateEvent onEventSent={refreshData} />

        <h2 style={{ color: '#1976d2', marginTop: 40 }}>Product Stock Overview</h2>
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
            <thead style={{ background: '#e3f2fd' }}>
          <tr>
                <th style={thStyle}>Product ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Current Quantity</th>
                <th style={thStyle}>Total Inventory Cost</th>
                <th style={thStyle}>Average Cost per Unit</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
                <tr key={p.product_id} style={{ textAlign: 'center' }}>
                  <td style={tdStyle}>{p.product_id}</td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.current_quantity}</td>
                  <td style={tdStyle}>{p.total_inventory_cost}</td>
                  <td style={tdStyle}>{p.average_cost_per_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ color: '#1976d2', marginTop: 40 }}>Sales Ledger</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
            <thead style={{ background: '#e3f2fd' }}>
              <tr>
                <th style={thStyle}>Timestamp</th>
                <th style={thStyle}>Product ID</th>
                <th style={thStyle}>Quantity Sold</th>
                <th style={thStyle}>Total Cost (FIFO)</th>
                <th style={thStyle}>Cost per Unit</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} style={{ textAlign: 'center' }}>
                  <td style={tdStyle}>{s.timestamp}</td>
                  <td style={tdStyle}>{s.product_id}</td>
                  <td style={tdStyle}>{s.quantity}</td>
                  <td style={tdStyle}>{s.total_cost}</td>
                  <td style={tdStyle}>{s.cost_per_unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px 16px',
  borderBottom: '2px solid #90caf9',
  fontWeight: 600,
  color: '#1976d2',
  background: '#e3f2fd',
};

const tdStyle = {
  padding: '8px 12px',
  borderBottom: '1px solid #e0e0e0',
};

export default App;
