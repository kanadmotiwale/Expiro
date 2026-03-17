import { useState } from 'react';
import PropTypes from 'prop-types';
import './WasteSummary.css';

const WasteSummary = ({ reports, loading }) => {
  const [search, setSearch] = useState('');

  if (loading) return <p className="loading">Loading summary...</p>;

  const summary = reports.reduce((acc, r) => {
    const key = r.productName;
    if (!acc[key]) acc[key] = { productName: key, totalRemoved: 0, count: 0 };
    acc[key].totalRemoved += r.quantityRemoved;
    acc[key].count += 1;
    return acc;
  }, {});

  const sorted = Object.values(summary)
    .sort((a, b) => b.totalRemoved - a.totalRemoved)
    .filter((s) => s.productName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="waste-summary">
      <div className="waste-summary-header">
        <div>
          <h2>Waste Summary</h2>
          <p className="subtext">{sorted.length} products — sorted by highest waste</p>
        </div>
      </div>
      <div className="waste-summary-filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {sorted.length === 0 ? (
        <p className="no-data">No results found.</p>
      ) : (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Total Qty Removed</th>
              <th>No. of Reports</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.productName}>
                <td>{s.productName}</td>
                <td>{s.totalRemoved}</td>
                <td>{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

WasteSummary.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      productName: PropTypes.string.isRequired,
      quantityRemoved: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default WasteSummary;
