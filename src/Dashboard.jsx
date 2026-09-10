import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://autoppc-backend.onrender.com';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <nav style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <h1 style={{ color: '#0066CC', marginBottom: '1rem' }}>AutoPPC Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button>Dashboard</button>
          <button>Campaigns</button>
          <button>Settings</button>
        </div>
      </nav>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>Total Spend</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>$0</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>Total Sales</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>$0</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>Average ACoS</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>0%</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>Savings</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>$0</p>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '2rem' }}>
            <h2>Users</h2>
            {users.length === 0 ? (
              <p style={{ color: '#666' }}>No users yet. Connect your Amazon account in Settings.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '1rem' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>{user.name || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}