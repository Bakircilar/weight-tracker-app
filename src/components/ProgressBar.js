// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ percentage, label, color = '#3498db' }) => {
  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;