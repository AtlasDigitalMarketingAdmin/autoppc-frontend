import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://autoppc-backend.onrender.com';

export default function App() {
  const [page, setPage] = useState('login'); // 'login', 'signup', 'dashboard', 'pricing'
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);

  // Check if logged in on load
  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCampaigns();
      fetchSubscription();
      setPage('dashboard');
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(response.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payments/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(response.data.subscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        email, password, name
      });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setPage('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email, password
      });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setPage('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCSV = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`${API_URL}/api/campaigns/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFile(null);
      setError('');
      fetchCampaigns();
      alert('Campaigns imported successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCampaigns([]);
    setPage('login');
  };

  // LOGIN PAGE
  if (page === 'login' && !token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h1 style={{ color: '#0066CC', textAlign: 'center' }}>AutoPPC</h1>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#0066CC',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <a href="#" onClick={() => { setPage('signup'); setError(''); }} style={{ color: '#0066CC', cursor: 'pointer' }}>
            Sign up
          </a>
        </p>
      </div>
    );
  }

  // SIGNUP PAGE
  if (page === 'signup' && !token) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h1 style={{ color: '#0066CC', textAlign: 'center' }}>AutoPPC</h1>
        <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#0066CC',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <a href="#" onClick={() => { setPage('login'); setError(''); }} style={{ color: '#0066CC', cursor: 'pointer' }}>
            Login
          </a>
        </p>
      </div>
    );
  }

  // DASHBOARD
  if (page === 'dashboard' && token && user) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
          <h1 style={{ color: '#0066CC', margin: 0 }}>AutoPPC</h1>
          <div>
            <span style={{ marginRight: '1rem' }}>Hello, {user.name}!</span>
            <button
              onClick={() => setPage('pricing')}
              style={{ marginRight: '1rem', padding: '8px 12px', background: '#0066CC', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {subscription ? '✓ Subscribed' : 'Upgrade'}
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: '8px 12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* CSV Upload */}
        <div style={{ background: '#f0f0f0', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2>Import Campaigns</h2>
          <p>Download your campaigns from Amazon Ads, then upload the CSV here.</p>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0])}
              style={{ marginRight: '1rem' }}
            />
            <button
              onClick={handleUploadCSV}
              disabled={loading || !file}
              style={{
                padding: '8px 16px',
                background: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>

        {/* Campaigns Table */}
        {campaigns.length > 0 ? (
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '2rem' }}>
            <h2>Your Campaigns</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Campaign Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{campaign.campaign_name}</td>
                    <td style={{ padding: '1rem' }}>{campaign.status}</td>
                    <td style={{ padding: '1rem' }}>{new Date(campaign.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>Upload a CSV to see your campaigns</p>
        )}
      </div>
    );
  }

  // PRICING PAGE
  if (page === 'pricing' && token) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <button
          onClick={() => setPage('dashboard')}
          style={{ marginBottom: '2rem', padding: '8px 12px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Back
        </button>

        <h1 style={{ color: '#0066CC', textAlign: 'center' }}>Choose Your Plan</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          {[
            { name: 'Starter', price: '$9', features: ['Up to $2k/mo spend', 'Basic automation', 'Email support'], id: 'starter' },
            { name: 'Growth', price: '$29', features: ['Up to $5k/mo spend', 'Advanced automation', 'Priority support'], id: 'growth' },
            { name: 'Professional', price: '$99', features: ['$5k+ spend', 'Full automation', 'Dedicated support'], id: 'professional' }
          ].map(plan => (
            <div key={plan.id} style={{ border: '2px solid #ddd', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
              <h2>{plan.name}</h2>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>{plan.price}/mo</p>
              <ul style={{ textAlign: 'left', marginBottom: '2rem' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>✓ {feature}</li>
                ))}
              </ul>
              <button
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}