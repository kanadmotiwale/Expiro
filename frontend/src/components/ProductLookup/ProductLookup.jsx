import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Leaf, Apple, Milk, Croissant, Wheat, Snowflake,
    Cookie, Candy, Coffee, Sun, Package, Droplets, SprayCan
} from 'lucide-react';
import './ProductLookup.css';

const CATEGORY_CONFIG = {
    'Produce':                  { icon: Leaf,       color: '#16a34a', bg: '#dcfce7' },
    'Fruits':                   { icon: Apple,      color: '#dc2626', bg: '#fee2e2' },
    'Dairy':                    { icon: Milk,       color: '#2563eb', bg: '#dbeafe' },
    'Bakery':                   { icon: Croissant,  color: '#d97706', bg: '#fef3c7' },
    'Pasta & Grains':           { icon: Wheat,      color: '#ca8a04', bg: '#fef9c3' },
    'Frozen Foods':             { icon: Snowflake,  color: '#0891b2', bg: '#cffafe' },
    'Snacks':                   { icon: Cookie,     color: '#ea580c', bg: '#ffedd5' },
    'Chocolates & Candy':       { icon: Candy,      color: '#9333ea', bg: '#f3e8ff' },
    'Beverages':                { icon: Coffee,     color: '#0284c7', bg: '#e0f2fe' },
    'Breakfast':                { icon: Sun,        color: '#f59e0b', bg: '#fffbeb' },
    'Canned & Packaged Foods':  { icon: Package,    color: '#64748b', bg: '#f1f5f9' },
    'Toiletries & Personal Care': { icon: Droplets, color: '#06b6d4', bg: '#ecfeff' },
    'Cleaning Supplies':        { icon: SprayCan,   color: '#0d9488', bg: '#ccfbf1' },
};

const totalStock = (p) =>
    (p.batches || []).reduce((sum, b) => sum + (b.remainingQuantity || 0), 0);

const ProductLookup = ({ products, loading }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [...new Set(products.map((p) => p.category))];

    const filtered = products
        .filter((p) => {
            const matchSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.shelfLocation.toLowerCase().includes(search.toLowerCase());
            const matchCategory = selectedCategory ? p.category === selectedCategory : true;
            return matchSearch && matchCategory;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const isSearching = search !== '' || selectedCategory !== null;

    if (loading) return <p className="loading">Loading products...</p>;

    return (
        <div className="product-lookup">
            <div className="lookup-header">
                <div>
                    {selectedCategory ? (
                        <>
                            <div className="lookup-header-left">
                                <button className="btn-back" onClick={() => { setSelectedCategory(null); setSearch(''); }}>← Back</button>
                                <div>
                                    <h2>{selectedCategory}</h2>
                                    <p className="subtext">{filtered.length} products in this category</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Product Lookup</h2>
                            <p className="subtext">Select a category or search for a product</p>
                        </>
                    )}
                </div>
            </div>

            {/* Search bar — always visible */}
            <div className="lookup-search">
                <input
                    type="text"
                    placeholder="Search by product name or shelf location..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null); }}
                />
            </div>

            {/* Category Grid — show when no search and no category selected */}
            {!isSearching ? (
                <div className="category-grid">
                    {categories.map((cat) => {
                        const config = CATEGORY_CONFIG[cat] || { icon: Package, color: '#64748b', bg: '#f1f5f9' };
                        const Icon = config.icon;
                        const count = products.filter((p) => p.category === cat).length;
                        return (
                            <div key={cat} className="cat-card" onClick={() => setSelectedCategory(cat)}>
                                <div className="cat-icon-wrap" style={{ backgroundColor: config.bg }}>
                                    <Icon size={28} color={config.color} strokeWidth={1.75} />
                                </div>
                                <p className="cat-name">{cat}</p>
                                <p className="cat-count">{count} products</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Product Table */
                filtered.length === 0 ? (
                    <div className="lookup-empty">
                        <p>No products found for "<strong>{search || selectedCategory}</strong>"</p>
                    </div>
                ) : (
                    <table className="lookup-table">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Shelf Location</th>
                            <th>Stock Status</th>
                            <th>Units Available</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((p) => {
                            const stock = totalStock(p);
                            const status = stock === 0 ? 'out' : stock < 20 ? 'low' : 'in';
                            return (
                                <tr key={p._id}>
                                    <td className="bold">{p.name}</td>
                                    <td>{p.category}</td>
                                    <td><span className="shelf-tag">{p.shelfLocation}</span></td>
                                    <td>
                      <span className={`stock-status stock-${status}`}>
                        {status === 'out' ? '✕ Out of Stock' : status === 'low' ? '⚠ Low Stock' : '✓ In Stock'}
                      </span>
                                    </td>
                                    <td>{stock} units</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
};

ProductLookup.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            shelfLocation: PropTypes.string.isRequired,
            batches: PropTypes.array,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
};

export default ProductLookup;