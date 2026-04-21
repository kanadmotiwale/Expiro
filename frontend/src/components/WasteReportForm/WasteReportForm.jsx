import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './WasteReportForm.css';

const emptyForm = {
  productId: '',
  productName: '',
  quantityRemoved: '',
  reason: 'expired',
  reportedBy: '',
  notes: '',
};

const WasteReportForm = ({ onSubmit, onCancel, initial, products }) => {
  const [form, setForm] = useState(emptyForm);
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

  const handleProductSelect = (e) => {
    const selected = products.find((p) => p._id === e.target.value);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        productId: selected._id,
        productName: selected.name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, quantityRemoved: parseInt(form.quantityRemoved) });
  };

  return (
    <div
      className="waste-form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waste-form-title"
    >
      <div className="waste-form-card" ref={modalRef}>
        <h2 id="waste-form-title">
          {initial ? 'Edit Waste Report' : 'Log Waste Report'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="waste-product">Product</label>
            <select
              id="waste-product"
              value={form.productId}
              onChange={handleProductSelect}
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="waste-quantity">Quantity Removed</label>
            <input
              id="waste-quantity"
              name="quantityRemoved"
              type="number"
              value={form.quantityRemoved}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="waste-reason">Reason</label>
            <select
              id="waste-reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
            >
              <option value="expired">Expired</option>
              <option value="damaged">Damaged</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="waste-reported-by">Reported By</label>
            <input
              id="waste-reported-by"
              name="reportedBy"
              value={form.reportedBy}
              onChange={handleChange}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="waste-notes">Notes</label>
            <input
              id="waste-notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initial ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

WasteReportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  initial: PropTypes.shape({
    productId: PropTypes.string,
    productName: PropTypes.string,
    quantityRemoved: PropTypes.number,
    reason: PropTypes.string,
    reportedBy: PropTypes.string,
    notes: PropTypes.string,
  }),
};

WasteReportForm.defaultProps = {
  initial: null,
};

export default WasteReportForm;
