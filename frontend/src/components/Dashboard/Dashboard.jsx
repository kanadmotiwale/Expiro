import { useState } from 'react';
import PropTypes from 'prop-types';
import ProductList from '../ProductList/ProductList.jsx';
import ProductForm from '../ProductForm/ProductForm.jsx';
import ExpiryDashboard from '../ExpiryDashboard/ExpiryDashboard.jsx';
import WasteReportList from '../WasteReportList/WasteReportList.jsx';
import WasteReportForm from '../WasteReportForm/WasteReportForm.jsx';
import WasteSummary from '../WasteSummary/WasteSummary.jsx';
import ProductLookup from '../ProductLookup/ProductLookup.jsx';
import useProducts from '../../hooks/useProducts.js';
import useWasteReports from '../../hooks/useWasteReports.js';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState(user.role === 'manager' ? 'products' : 'expiry');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showWasteForm, setShowWasteForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingReport, setEditingReport] = useState(null);

    const { products, loading: pLoading, addProduct, editProduct, removeProduct, fetchProducts } = useProducts();
    const { reports, loading: wLoading, addReport, editReport, removeReport } = useWasteReports();

    const handleProductSubmit = async (data) => {
        if (editingProduct) {
            await editProduct(editingProduct._id, data);
        } else {
            await addProduct(data);
        }
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleWasteSubmit = async (data) => {
        if (editingReport && editingReport._id) {
            await editReport(editingReport._id, data);
        } else {
            await addReport(data);
        }
        setShowWasteForm(false);
        setEditingReport(null);
    };

    const handleLogWasteFromExpiry = (item) => {
        setEditingReport({
            productId: item.productId,
            productName: item.productName,
            quantityRemoved: item.quantity,
            reason: 'expired',
            reportedBy: user.username,
            notes: '',
        });
        setShowWasteForm(true);
        setActiveTab('waste');
    };

    const managerTabs = [
        { key: 'products', label: 'Products' },
        { key: 'expiry', label: 'Expiry Dashboard' },
        { key: 'waste', label: 'Waste Reports' },
        { key: 'summary', label: 'Waste Summary' },
    ];

    const employeeTabs = [
        { key: 'expiry', label: 'Expiry Dashboard' },
        { key: 'lookup', label: 'Product Lookup' },
        { key: 'waste', label: 'Waste Reports' },
    ];

    const tabs = user.role === 'manager' ? managerTabs : employeeTabs;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-logo">Expiro</h1>
                <div className="dashboard-user">
                    <span>{user.username} ({user.role})</span>
                    <button className="btn-logout" onClick={onLogout}>Logout</button>
                </div>
            </header>

            <nav className="dashboard-nav">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        className={`nav-tab ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <main className="dashboard-content">
                {activeTab === 'products' && user.role === 'manager' && (
                    <ProductList
                        products={products}
                        loading={pLoading}
                        onEdit={(p) => { setEditingProduct(p); setShowProductForm(true); }}
                        onDelete={removeProduct}
                        onAdd={() => { setEditingProduct(null); setShowProductForm(true); }}
                    />
                )}
                {activeTab === 'expiry' && (
                    <ExpiryDashboard
                        products={products}
                        loading={pLoading}
                        user={user}
                        onProductsUpdate={fetchProducts}
                        onLogWaste={handleLogWasteFromExpiry}
                    />
                )}
                {activeTab === 'lookup' && (
                    <ProductLookup products={products} loading={pLoading} />
                )}
                {activeTab === 'waste' && (
                    <WasteReportList
                        reports={reports}
                        loading={wLoading}
                        onEdit={(r) => { setEditingReport(r); setShowWasteForm(true); }}
                        onDelete={removeReport}
                        onAdd={() => { setEditingReport(null); setShowWasteForm(true); }}
                    />
                )}
                {activeTab === 'summary' && user.role === 'manager' && (
                    <WasteSummary reports={reports} loading={wLoading} />
                )}
            </main>

            {showProductForm && (
                <ProductForm
                    onSubmit={handleProductSubmit}
                    onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
                    initial={editingProduct}
                />
            )}

            {showWasteForm && (
                <WasteReportForm
                    onSubmit={handleWasteSubmit}
                    onCancel={() => { setShowWasteForm(false); setEditingReport(null); }}
                    initial={editingReport}
                    products={products}
                />
            )}
        </div>
    );
};

Dashboard.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default Dashboard;