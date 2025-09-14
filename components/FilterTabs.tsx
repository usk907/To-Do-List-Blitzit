
import React from 'react';
import { FilterType } from '../types';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-slate-900/50 p-1 rounded-lg">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 ${
            activeFilter === value
              ? 'bg-slate-700/60 text-white'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
