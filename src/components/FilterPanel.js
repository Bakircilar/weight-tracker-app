// src/components/FilterPanel.js
import React from 'react';

const FilterPanel = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <div className="filter-title">Veri Filtresi:</div>
      <div className="filter-options">
        <button 
          className={`filter-button ${currentFilter === 'week' ? 'active' : ''}`}
          onClick={() => onFilterChange('week')}
        >
          Haftalık
        </button>
        <button 
          className={`filter-button ${currentFilter === 'month' ? 'active' : ''}`}
          onClick={() => onFilterChange('month')}
        >
          Aylık
        </button>
        <button 
          className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Tümü
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;