import React from 'react';

const ErrorComponent = ({ error }) => {
  console.error("Error loading data:", error);
  
  return (
    <div className="error-container">
      <h2>Error Loading Data</h2>
      <p>There was a problem loading the wildlife data. Please try again later.</p>
      <p className="error-details">Details: {error.message}</p>
    </div>
  );
};

export default ErrorComponent;
