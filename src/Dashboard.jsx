import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'https://shark-app-vyjis.ondigitalocean.app';

export default function Dashboard() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCampaigns();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      handleLogout();
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
      alert('✓ Campaigns imported successfully!');
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
    window.location.reload();
  };

  const stats = {
    totalCampaigns: campaigns.length,
    totalSpend: campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0),
    avgAcos: campaigns.length > 0 
      ? (campaigns.reduce((sum, c) => sum + (parseFloat(c.acos) || 0), 0) / campaigns.length).toFixed(1)
      : 0,
    potentialSavings: campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0) * 0.15
  };

  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Spend ($)',
        data: [145, 182, 198, 175, 212, 195, 168],
        borderColor: '#0066CC',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const acosData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'ACoS (%)',
        data: [28, 26, 24, 25, 23, 24, 27],
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const getCampaignHealth = (acos) => {
    const acosVal = parseFloat(acos) || 0;
    if (acosVal < 20) return { label: 'Excellent', color: '#00aa00', bg: '#e8f5e9' };
    if (acosVal < 30) return { label: 'Good', color: '#0066CC', bg: '#e3f2fd' };
    if (acosVal < 40) return { label: 'Fair', color: '#ff9800', bg: '#fff3e0' };
    return { label: 'Needs Work', color: '#ff6b6b', bg: '#ffebee' };
  };

  if (!token || !user) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <nav style={{ background: 'white', borderBottom: '2px solid #0066CC', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#0066CC', margin: 0, fontSize: '28px' }}>AutoPPC</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>👋 {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0066CC' }}>
            <p style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>CAMPAIGNS</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>{stats.totalCampaigns}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0066CC' }}>
            <p style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>TOTAL SPEND</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>${stats.totalSpend.toFixed(0)}</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0066CC' }}>
            <p style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>AVG ACoS</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066CC', margin: 0 }}>{stats.avgAcos}%</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #00aa00' }}>
            <p style={{ color: '#666', fontSize: '12px', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>POTENTIAL SAVINGS</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#00aa00', margin: 0 }}>${stats.potentialSavings.toFixed(0)}</p>
          </div>
        </div>

        {/* Upload Section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, color: '#0066CC' }}>📊 Import Campaigns</h2>
          <p style={{ color: '#666' }}>Download your campaigns from Amazon Ads Manager and upload the CSV file here.</p>
          
          {error && <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>❌ {error}</p>}
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0])}
              style={{
                padding: '8px 12px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                flex: 1
              }}
            />
            <button
              onClick={handleUploadCSV}
              disabled={loading || !file}
              style={{
                padding: '10px 24px',
                background: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: loading || !file ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Uploading...' : '📤 Upload CSV'}
            </button>
          </div>
        </div>

        {/* Charts */}
        {campaigns.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, color: '#0066CC' }}>💰 Spending Trend</h3>
              <Line data={trendData} options={chartOptions} />
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, color: '#0066CC' }}>📈 ACoS Trend</h3>
              <Line data={acosData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Campaigns Table */}
        {campaigns.length > 0 ? (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop: 0, color: '#0066CC' }}>🎯 Your Campaigns</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '3px solid #0066CC', background: '#f5f5f5' }}>
                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', color: '#0066CC' }}>Campaign</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', color: '#0066CC' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', color: '#0066CC' }}>Health</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', color: '#0066CC' }}>Budget</th>
                    <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', color: '#0066CC' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => {
                    const health = getCampaignHealth(campaign.acos);
                    return (
                      <tr key={campaign.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem' }}>
                          <strong>{campaign.campaign_name}</strong>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: '#e3f2fd',
                            color: '#0066CC',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {campaign.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            background: health.bg,
                            color: health.color,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {health.label}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>${(campaign.budget || 0).toFixed(0)}</td>
                        <td style={{ padding: '1rem', fontSize: '12px', color: '#666' }}>
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#666', fontSize: '16px' }}>📂 No campaigns yet. Upload a CSV to get started!</p>
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center', color: '#999', fontSize: '12px' }}>
          <p>AutoPPC • Automated Amazon PPC Management</p>
        </div>
      </div>
    </div>
  );
}