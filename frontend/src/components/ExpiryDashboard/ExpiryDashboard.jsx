import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SellModal from '../SellModal/SellModal.jsx';
import { sellProduct } from '../../services/productAPI.js';
import './ExpiryDashboard.css';

const getUrgency = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diff = (expiry - today) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'expired';
  if (diff === 0) return 'today';
  if (diff <= 3) return 'soon';
  return 'ok';
};

const URGENCY_CONFIG = {
  expired: { label: 'Expired',            color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
  today:   { label: 'Expiring Today',     color: '#ea580c', bg: '#ffedd5', dot: '#ea580c' },
  soon:    { label: 'Expiring in 3 Days', color: '#ca8a04', bg: '#fef9c3', dot: '#ca8a04' },
};

const ExpiryDashboard = ({ products, loading, user, onProductsUpdate }) => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sellTarget, setSellTarget] = useState(null);
  const [sellError, setSellError] = useState('');

  useEffect(() => {
    const flat = products.flatMap((p) =>
      (p.batches || [])
        .filter((b) => (b.remainingQuantity || 0) > 0)
        .map((b) => ({
          productId: p._id,
          productName: p.name,
          category: p.category,
          shelfLocation: p.shelfLocation,
          quantity: b.remainingQuantity,
          expiryDate: b.expiryDate,
          urgency: getUrgency(b.expiryDate),
          batches: p.batches,
        }))
    ).filter((b) => b.urgency !== 'ok')
     .sort((a, b) => {
       const order = { expired: 0, today: 1, soon: 2 };
       return order[a.urgency] - order[b.urgency];
     });
    setItems(flat);
  }, [products]);

  const counts = {
    expired: items.filter((i) => i.urgency === 'expired').length,
    today:   items.filter((i) => i.urgency === 'today').length,
    soon:    items.filter((i) => i.urgency === 'soon').length,
  };

  const filtered = items.filter((i) => {
    const matchFilter = filter === 'all' || i.urgency === filter;
    const matchSearch = i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSellConfirm = async (qty) => {
    try {
      await sellProduct(sellTarget.productId, qty);
      setSellTarget(null);
      setSellError('');
      onProductsUpdate();
    } catch (err) {
      setSellError(err.message);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <p className="loading">Loading expiry data...</p>;

  return (
    <div className="expiry-dashboard">
      {/* Welcome Banner */}
      <div className="expiry-banner">
        <div>
          <h2>{greeting()}, {user?.username} 👋</h2>
          <p>{today}</p>
        </div>
        {counts.expired + counts.today > 0 && (
          <div className="banner-alert">
            ⚠️ {counts.expired + counts.today} item{counts.expired + counts.today > 1 ? 's' : ''} need immediate attention
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="expiry-summary-cards">
        <div className="summary-card expired" onClick={() => setFilter(filter === 'expired' ? 'all' : 'expired')}>
          <span className="summary-count">{counts.expired}</span>
          <span className="summary-label">Expired</span>
          <span className="summary-hint">Pull immediately</span>
        </div>
        <div className="summary-card today" onClick={() => setFilter(filter === 'today' ? 'all' : 'today')}>
          <span className="summary-count">{counts.today}</span>
          <span className="summary-label">Expiring Today</span>
          <span className="summary-hint">Check this morning</span>
        </div>
        <div className="summary-card soon" onClick={() => setFilter(filter === 'soon' ? 'all' : 'soon')}>
          <span className="summary-count">{counts.soon}</span>
          <span className="summary-label">Expiring in 3 Days</span>
          <span className="summary-hint">Monitor closely</span>
        </div>
      </div>

      {/* Filters */}
      <div className="expiry-filters">
        <input
          type="text"
          placeholder="Search by product or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Alerts</option>
          <option value="expired">Expired</option>
          <option value="today">Expiring Today</option>
          <option value="soon">Expiring in 3 Days</option>
        </select>
      </div>

      {sellError && <p className="sell-error-banner">{sellError}</p>}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="no-expiry">🎉 No expiring products match your filter!</div>
      ) : (
        <table className="expiry-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Product</th>
              <th>Category</th>
              <th>Shelf</th>
              <th>Remaining Qty</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const cfg = URGENCY_CONFIG[b.urgency];
              return (
                <tr key={i} style={{ background: cfg.bg }}>
                  <td>
                    <span className="status-badge" style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}40` }}>
                      <span className="status-dot" style={{ background: cfg.dot }} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="bold">{b.productName}</td>
                  <td>{b.category}</td>
                  <td>{b.shelfLocation}</td>
                  <td>{b.quantity}</td>
                  <td>{new Date(b.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-sell"
                      onClick={() => setSellTarget(b)}
                    >
                      Log Sale
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {sellTarget && (
        <SellModal
          product={sellTarget}
          onConfirm={handleSellConfirm}
          onCancel={() => { setSellTarget(null); setSellError(''); }}
        />
      )}
    </div>
  );
};

ExpiryDashboard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      shelfLocation: PropTypes.string.isRequired,
      batches: PropTypes.array,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onProductsUpdate: PropTypes.func.isRequired,
};

export default ExpiryDashboard;
