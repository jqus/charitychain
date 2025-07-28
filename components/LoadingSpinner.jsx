'use client';
// components/LoadingSpinner.js
import React from 'react';
import { Spinner } from 'reactstrap';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );
};

export default LoadingSpinner;
