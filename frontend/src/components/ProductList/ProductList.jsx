import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Leaf,
  Apple,
  Milk,
  Croissant,
  Wheat,
  Snowflake,
  Cookie,
  Candy,
  Coffee,
  Sun,
  Package,
  Droplets,
  SprayCan,
} from 'lucide-react';
import './ProductList.css';

const CATEGORY_CONFIG = {
  Produce: { icon: Leaf, color: '#16a34a', bg: '#dcfce7' },
  Fruits: { icon: Apple, color: '#dc2626', bg: '#fee2e2' },
  Dairy: { icon: Milk, color: '#2563eb', bg: '#dbeafe' },
  Bakery: { icon: Croissant, color: '#d97706', bg: '#fef3c7' },
  'Pasta & Grains': { icon: Wheat, color: '#ca8a04', bg: '#fef9c3' },
  'Frozen Foods': { icon: Snowflake, color: '#0891b2', bg: '#cffafe' },
  Snacks: { icon: Cookie, color: '#ea580c', bg: '#ffedd5' },
  'Chocolates & Candy': { icon: Candy, color: '#9333ea', bg: '#f3e8ff' },
  Beverages: { icon: Coffee, color: '#0284c7', bg: '#e0f2fe' },
  Breakfast: { icon: Sun, color: '#f59e0b', bg: '#fffbeb' },
  'Canned & Packaged Foods': { icon: Package, color: '#64748b', bg: '#f1f5f9' },
  'Toiletries & Personal Care': {
    icon: Droplets,
    color: '#06b6d4',
    bg: '#ecfeff',
  },
  'Cleaning Supplies': { icon: SprayCan, color: '#0d9488', bg: '#ccfbf1' },
};

const CategoryCard = ({ name, count, onClick }) => {
  const config = CATEGORY_CONFIG[name] || {
    icon: Package,
    color: '#64748b',
    bg: '#f1f5f9',
  };
  const Icon = config.icon;

  return (
    <button
      type="button"
      className="cat-card"
      onClick={onClick}
      aria-label={`${name}, ${count} products`}
    >
      <div
        className="cat-icon-wrap"
        style={{ backgroundColor: config.bg }}
        aria-hidden="true"
      >
        <Icon size={28} color={config.color} strokeWidth={1.75} />
      </div>
      <p className="cat-name">{name}</p>
      <p className="cat-count">{count} products</p>
    </button>
  );
};

CategoryCard.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ProductList = ({ products, loading, onEdit, onDelete, onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : false;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="product-list">
      {!selectedCategory ? (
        <>
          <div className="product-list-header">
            <div>
              <h2>Product Categories</h2>
              <p className="subtext">
                Select a category to view and manage products
              </p>
            </div>
            <button className="btn-add" onClick={onAdd}>
              Add Product
            </button>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard
                key={cat}
                name={cat}
                count={products.filter((p) => p.category === cat).length}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="product-list-header">
            <div className="header-left">
              <button
                className="btn-back"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearch('');
                }}
              >
                ← Back
              </button>
              <div>
                <h2>{selectedCategory}</h2>
                <p className="subtext">
                  {filteredProducts.length} products in this category
                </p>
              </div>
            </div>
            <button className="btn-add" onClick={onAdd}>
              Add Product
            </button>
          </div>
          <div className="product-filters">
            <label htmlFor="product-search" className="sr-only">
              Search products in {selectedCategory}
            </label>
            <input
              id="product-search"
              type="text"
              placeholder={`Search in ${selectedCategory}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            <table
              className="product-table"
              aria-label={`Products in ${selectedCategory}`}
            >
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Shelf Location</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.brand || '—'}</td>
                    <td>{p.shelfLocation}</td>
                    <td>
                      <span
                        className={`stock-badge ${p.stockCount < 30 ? 'low' : 'ok'}`}
                      >
                        {p.stockCount}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(p)}
                        aria-label={`Edit ${p.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(p._id)}
                        aria-label={`Delete ${p.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      shelfLocation: PropTypes.string.isRequired,
      stockCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default ProductList;
