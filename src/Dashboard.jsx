import { useState } from 'react';

export default function Dashboard() {
  const [connected] = useState(true);

  // Mock campaign data
  const campaigns = [
    {
      campaignId: '1',
      name: 'Kitchen Gadgets - Broad',
      state: 'ENABLED',
      budget: { budget: 500 },
      spend: 342.50,
      sales: 1285.00,
      acos: 26.6
    },
    {
      campaignId: '2',
      name: 'Kitchenware - Exact',
      state: 'ENABLED',
      budget: { budget: 300 },
      spend: 218.75,
      sales: 956.20,
      acos: 22.9
    },
    {
      campaignId: '3',
      name: 'Cookware - Auto',
      state: 'PAUSED',
      budget: { budget: 200 },
      spend: 145.20,
      sales: 425.60,
      acos: 34.1
    },
    {
      campaignId: '4',
      name: 'Baking Tools - Exact',
      state: 'ENABLED',
      budget: { budget: 250 },
      spend: 189.30,
      sales: 892.15,
      acos: 21.2
    }
  ];

  // Calculate totals
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalSales = campaigns.reduce((sum, c) => sum + c.sales, 0);
  const avgAcos = (totalSpend / totalSales * 100).toFixed(1);
  const savings = totalSpend * 0.15; // Estimated 15% savings with AutoPPC

  const activeCampaigns = campaigns.filter(c => c.state === 'ENABLED').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <nav style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <h1 style={{ color: '#0066CC', marginBottom: '1rem' }}>AutoPPC Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '8px 12px', border: 'none', background: '#0066CC', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Dashboard</button>
          <button style={{ padding: '8px 12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '4px' }}>Campaigns</button>
          <button style={{ padding: '8px 12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '4px' }}>Settings</button>
        </div>
      </nav>

      {connected && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '12px' }}>TOTAL SPEND</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>${totalSpend.toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '12px' }}>TOTAL SALES</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>${totalSales.toFixed(2)}</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '12px' }}>AVERAGE ACoS</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC' }}>{avgAcos}%</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '1.5rem', borderRadius: '8px' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '12px' }}>POTENTIAL SAVINGS</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00AA00' }}>${savings.toFixed(2)}</p>
            </div>
          </div>

          {/* Campaigns Table */}
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ marginTop: 0 }}>Your Campaigns ({activeCampaigns} active)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Campaign Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Budget</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Spend</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Sales</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>ACoS</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.campaignId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{campaign.name}</td>
                    <td style={{ padding: '1rem' }}>${campaign.budget.budget}</td>
                    <td style={{ padding: '1rem' }}>${campaign.spend.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>${campaign.sales.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>{campaign.acos}%</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: campaign.state === 'ENABLED' ? '#e8f5e9' : '#fff3e0',
                        color: campaign.state === 'ENABLED' ? '#2e7d32' : '#f57c00',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {campaign.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Box */}
          <div style={{ background: '#e8f4f8', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', borderLeft: '4px solid #0066CC' }}>
            <p style={{ margin: 0, color: '#0066CC', fontWeight: 'bold' }}>💡 Pro Tip: AutoPPC can help you optimize these campaigns to reduce ACoS by 10-30% automatically!</p>
          </div>
        </>
      )}
    </div>
  );
}