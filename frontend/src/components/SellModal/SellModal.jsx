import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './SellModal.css';

const SellModal = ({ product, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  const totalRemaining = product.batches
    ? product.batches.reduce((sum, b) => sum + (b.remainingQuantity || 0), 0)
    : 0;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    if (qty > totalRemaining) {
      setError(`Only ${totalRemaining} units available`);
      return;
    }
    onConfirm(qty);
  };

  return (
    <div
      className="sell-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sell-modal-title"
    >
      <div className="sell-card" ref={modalRef}>
        <h2 id="sell-modal-title">Log Sale</h2>
        <p className="sell-product-name">{product.productName}</p>
        <p className="sell-stock">
          Available stock: <strong>{totalRemaining} units</strong>
        </p>

        {error && (
          <p className="sell-error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="sell-input-group">
            <label htmlFor="sell-quantity">Units Sold</label>
            <input
              id="sell-quantity"
              type="number"
              min="1"
              max={totalRemaining}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError('');
              }}
              placeholder="Enter quantity sold"
            />
          </div>
          <div className="sell-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-confirm">
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SellModal.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    batches: PropTypes.array,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SellModal;
