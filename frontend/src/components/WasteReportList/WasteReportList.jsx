import { useState } from 'react';
import PropTypes from 'prop-types';
import './WasteReportList.css';

const WasteReportList = ({ reports, loading, onEdit, onDelete, onAdd }) => {
  const [search, setSearch] = useState('');
  const [filterReason, setFilterReason] = useState('');

  const filtered = [...reports]
    .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    .filter((r) => {
      const matchSearch =
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.reportedBy.toLowerCase().includes(search.toLowerCase());
      const matchReason = filterReason ? r.reason === filterReason : true;
      return matchSearch && matchReason;
    });

  if (loading) return <p className="loading">Loading waste reports...</p>;

  return (
    <div className="waste-report-list">
      <div className="waste-report-header">
        <div>
          <h2>Waste Reports</h2>
          <p className="subtext">
            {filtered.length} records — sorted by most recent
          </p>
        </div>
        <button className="btn-add" onClick={onAdd}>
          Log Waste
        </button>
      </div>

      <div className="waste-filters">
        <label htmlFor="waste-search" className="sr-only">
          Search by product or employee
        </label>
        <input
          id="waste-search"
          type="text"
          placeholder="Search by product or employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="waste-reason-filter" className="sr-only">
          Filter by reason
        </label>
        <select
          id="waste-reason-filter"
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
        >
          <option value="">All Reasons</option>
          <option value="expired">Expired</option>
          <option value="damaged">Damaged</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="no-reports" role="status">
          No waste reports found.
        </p>
      ) : (
        <table className="waste-table" aria-label="Waste reports">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Qty Removed</th>
              <th scope="col">Reason</th>
              <th scope="col">Reported By</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.productName}</td>
                <td>{r.quantityRemoved}</td>
                <td>
                  <span className={`reason-badge reason-${r.reason}`}>
                    {r.reason}
                  </span>
                </td>
                <td>{r.reportedBy}</td>
                <td>{new Date(r.reportedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(r)}
                    aria-label={`Edit waste report for ${r.productName}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(r._id)}
                    aria-label={`Delete waste report for ${r.productName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

WasteReportList.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      quantityRemoved: PropTypes.number.isRequired,
      reason: PropTypes.string.isRequired,
      reportedBy: PropTypes.string.isRequired,
      reportedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default WasteReportList;
