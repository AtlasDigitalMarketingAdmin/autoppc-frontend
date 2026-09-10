import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://autoppc-backend.onrender.com';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectAmazon = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/amazon`);
      window.location.href = response.data.url;
    } catch (err) {
      setError('Failed to connect: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ color: '#0066CC' }}>AutoPPC Dashboard</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ background: '#f0f0f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Connect Your Amazon Account</h2>
        <p>Link your Amazon Ads account to start automating PPC.</p>
        <button 
          onClick={connectAmazon}
          disabled={loading}
          style={{
            background: '#0066CC',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Connecting...' : 'Connect Amazon Account'}
        </button>
      </div>
    </div>
  );
}