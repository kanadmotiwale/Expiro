import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ProductForm.css';

const CATEGORIES = [
  'Produce',
  'Fruits',
  'Dairy',
  'Bakery',
  'Pasta & Grains',
  'Frozen Foods',
  'Snacks',
  'Chocolates & Candy',
  'Beverages',
  'Breakfast',
  'Canned & Packaged Foods',
  'Toiletries & Personal Care',
  'Cleaning Supplies',
];

const emptyForm = {
  name: '',
  category: '',
  shelfLocation: '',
  stockCount: 0,
  batches: [],
};

const ProductForm = ({ onSubmit, onCancel, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [batch, setBatch] = useState({ quantity: '', expiryDate: '' });
  const modalRef = useRef(null);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addBatch = () => {
    if (!batch.quantity || !batch.expiryDate) return;
    setForm((prev) => ({
      ...prev,
      batches: [
        ...prev.batches,
        {
          quantity: parseInt(batch.quantity),
          expiryDate: new Date(batch.expiryDate),
          receivedAt: new Date(),
        },
      ],
    }));
    setBatch({ quantity: '', expiryDate: '' });
  };

  const removeBatch = (idx) => {
    setForm((prev) => ({
      ...prev,
      batches: prev.batches.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="product-form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="product-form-card" ref={modalRef}>
        <h2 id="product-form-title">
          {initial ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="product-name">Name</label>
            <input
              id="product-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product-shelf">Shelf Location</label>
            <input
              id="product-shelf"
              name="shelfLocation"
              value={form.shelfLocation}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-stock">Stock Count</label>
            <input
              id="product-stock"
              name="stockCount"
              type="number"
              value={form.stockCount}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="batch-section">
            <h3>Stock Batches</h3>
            <div className="batch-inputs">
              <label htmlFor="batch-quantity" className="sr-only">
                Batch quantity
              </label>
              <input
                id="batch-quantity"
                type="number"
                placeholder="Quantity"
                value={batch.quantity}
                onChange={(e) =>
                  setBatch((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
              <label htmlFor="batch-expiry" className="sr-only">
                Batch expiry date
              </label>
              <input
                id="batch-expiry"
                type="date"
                value={batch.expiryDate}
                onChange={(e) =>
                  setBatch((prev) => ({ ...prev, expiryDate: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={addBatch}
                className="btn-add-batch"
              >
                Add Batch
              </button>
            </div>
            {form.batches.length > 0 && (
              <ul className="batch-list">
                {form.batches.map((b, i) => (
                  <li key={i}>
                    Qty: {b.quantity} — Expires:{' '}
                    {new Date(b.expiryDate).toLocaleDateString()}
                    <button
                      type="button"
                      onClick={() => removeBatch(i)}
                      className="btn-remove-batch"
                      aria-label={`Remove batch ${i + 1}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initial ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initial: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    shelfLocation: PropTypes.string,
    stockCount: PropTypes.number,
    batches: PropTypes.array,
  }),
};

ProductForm.defaultProps = {
  initial: null,
};

export default ProductForm;
