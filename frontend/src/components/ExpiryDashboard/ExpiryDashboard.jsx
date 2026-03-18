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
    if (diff < 0) return { status: 'expired', days: diff };
    if (diff === 0) return { status: 'today', days: 0 };
    if (diff <= 3) return { status: 'soon', days: diff };
    return { status: 'ok', days: diff };
};

const timeLeft = (days) => {
    if (days < 0) return `Expired ${Math.abs(Math.round(days))} day${Math.abs(Math.round(days)) !== 1 ? 's' : ''} ago`;
    if (days === 0) return 'Expires today';
    return `Expires in ${Math.round(days)} day${Math.round(days) !== 1 ? 's' : ''}`;
};

const getRecommendedAction = (status, qty) => {
    if (status === 'expired') return { label: 'Discard immediately', color: '#dc2626' };
    if (status === 'today' && qty > 20) return { label: 'Move to discount shelf', color: '#ea580c' };
    if (status === 'today') return { label: 'Prioritize sale', color: '#ea580c' };
    if (status === 'soon' && qty > 30) return { label: 'Apply discount', color: '#ca8a04' };
    return { label: 'Monitor closely', color: '#64748b' };
};

const getWasteRisk = (status, qty) => {
    if (status === 'expired') return { label: 'Critical', color: '#dc2626', bg: '#fee2e2' };
    if ((status === 'today' || status === 'soon') && qty > 30) return { label: 'High', color: '#ea580c', bg: '#ffedd5' };
    if ((status === 'today' || status === 'soon') && qty > 10) return { label: 'Medium', color: '#ca8a04', bg: '#fef9c3' };
    return { label: 'Low', color: '#16a34a', bg: '#dcfce7' };
};

const URGENCY_CONFIG = {
    expired: { label: 'Expired',            color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
    today:   { label: 'Expiring Today',     color: '#ea580c', bg: '#ffedd5', dot: '#ea580c' },
    soon:    { label: 'Expiring in 3 Days', color: '#ca8a04', bg: '#fef9c3', dot: '#ca8a04' },
};

const ExpiryDashboard = ({ products, loading, user, onProductsUpdate, onLogWaste }) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const [search, setSearch] = useState('');
    const [groupByProduct, setGroupByProduct] = useState(false);
    const [sellTarget, setSellTarget] = useState(null);
    const [sellError, setSellError] = useState('');

    useEffect(() => {
        const flat = products.flatMap((p) =>
            (p.batches || [])
                .filter((b) => (b.remainingQuantity || 0) > 0)
                .map((b) => {
                    const { status, days } = getUrgency(b.expiryDate);
                    return {
                        productId: p._id,
                        productName: p.name,
                        category: p.category,
                        shelfLocation: p.shelfLocation,
                        quantity: b.remainingQuantity,
                        expiryDate: b.expiryDate,
                        status,
                        days,
                        batches: p.batches,
                    };
                })
        ).filter((b) => b.status !== 'ok')
            .sort((a, b) => {
                const order = { expired: 0, today: 1, soon: 2 };
                return order[a.status] - order[b.status];
            });
        setItems(flat);
    }, [products]);

    const categories = [...new Set(items.map((i) => i.category))];

    const counts = {
        expired: items.filter((i) => i.status === 'expired').length,
        today:   items.filter((i) => i.status === 'today').length,
        soon:    items.filter((i) => i.status === 'soon').length,
    };

    const filtered = items.filter((i) => {
        const risk = getWasteRisk(i.status, i.quantity).label;
        const matchFilter = filter === 'all' || i.status === filter;
        const matchCategory = !categoryFilter || i.category === categoryFilter;
        const matchRisk = !riskFilter || risk === riskFilter;
        const matchSearch = i.productName.toLowerCase().includes(search.toLowerCase()) ||
            i.category.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchCategory && matchRisk && matchSearch;
    });

    // Group by product
    const grouped = filtered.reduce((acc, item) => {
        if (!acc[item.productName]) acc[item.productName] = [];
        acc[item.productName].push(item);
        return acc;
    }, {});

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

    const handleQuickSell = async (item, qty) => {
        try {
            await sellProduct(item.productId, qty);
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

    const renderRow = (b, i) => {
        const cfg = URGENCY_CONFIG[b.status];
        const action = getRecommendedAction(b.status, b.quantity);
        const risk = getWasteRisk(b.status, b.quantity);
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
                <td>
                    <span className="time-left">{timeLeft(b.days)}</span>
                </td>
                <td>
          <span className="risk-badge" style={{ color: risk.color, background: risk.bg }}>
            {risk.label}
          </span>
                </td>
                <td>
          <span className="action-label" style={{ color: action.color }}>
            {action.label}
          </span>
                </td>
                <td>
                    <div className="action-btns">
                        <button className="btn-sell" onClick={() => setSellTarget(b)}>Log Sale</button>
                        <button className="btn-waste" onClick={() => onLogWaste(b)}>Waste</button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="expiry-dashboard">
            {/* Welcome Banner */}
            <div className="expiry-banner">
                <div>
                    <h2>{greeting()}, {user?.username} 👋</h2>
                    <p>{today}</p>
                </div>
                {counts.expired + counts.today > 0 && (
                    <div className="banner-alert" onClick={() => setFilter('expired')}>
                        ⚠️ {counts.expired + counts.today} items need attention → View Critical
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="expiry-summary-cards">
                <div className="summary-card expired" onClick={() => setFilter(filter === 'expired' ? 'all' : 'expired')}>
                    <span className="summary-count">{counts.expired}</span>
                    <span className="summary-label">Expired</span>
                    <span className="summary-hint">Discard immediately</span>
                </div>
                <div className="summary-card today" onClick={() => setFilter(filter === 'today' ? 'all' : 'today')}>
                    <span className="summary-count">{counts.today}</span>
                    <span className="summary-label">Expiring Today</span>
                    <span className="summary-hint">Prioritize sale</span>
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
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                    <option value="">All Risk Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                </select>
                <label className="group-toggle">
                    <span>Group by Product</span>
                    <input
                        type="checkbox"
                        checked={groupByProduct}
                        onChange={(e) => setGroupByProduct(e.target.checked)}
                    />
                </label>
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
                        <th>Qty</th>
                        <th>Time Left</th>
                        <th>Waste Risk</th>
                        <th>Recommended Action</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groupByProduct
                        ? Object.entries(grouped).map(([name, batches]) => (
                            <>
                                <tr key={`group-${name}`} className="group-header-row">
                                    <td colSpan={9}>
                                        <span className="group-label">📦 {name}</span>
                                        <span className="group-meta">{batches.length} batch{batches.length > 1 ? 'es' : ''} · Total qty: {batches.reduce((s, b) => s + b.quantity, 0)} · Nearest expiry: {new Date(batches[0].expiryDate).toLocaleDateString()}</span>
                                    </td>
                                </tr>
                                {batches.map((b, i) => renderRow(b, `${name}-${i}`))}
                            </>
                        ))
                        : filtered.map((b, i) => renderRow(b, i))}
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
    products: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        shelfLocation: PropTypes.string.isRequired,
        batches: PropTypes.array,
    })).isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
    onProductsUpdate: PropTypes.func.isRequired,
    onLogWaste: PropTypes.func.isRequired,
};

export default ExpiryDashboard;