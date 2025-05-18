import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, total }) => {
  return (
    <div className="card text-center shadow-sm p-4 rounded">
      <h5 className="fw-bold">{title}</h5>
      <p className="text-muted">Total: {total}</p>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardCard;
