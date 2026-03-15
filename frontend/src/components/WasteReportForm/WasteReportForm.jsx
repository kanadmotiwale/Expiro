import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

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
    <div className="waste-form-overlay">
      <div className="waste-form-card">
        <h2>{initial ? 'Edit Waste Report' : 'Log Waste Report'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product</label>
            <select value={form.productId} onChange={handleProductSelect} required>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity Removed</label>
            <input
              name="quantityRemoved"
              type="number"
              value={form.quantityRemoved}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <select name="reason" value={form.reason} onChange={handleChange}>
              <option value="expired">Expired</option>
              <option value="damaged">Damaged</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Reported By</label>
            <input
              name="reportedBy"
              value={form.reportedBy}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">{initial ? 'Update' : 'Submit'}</button>
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
