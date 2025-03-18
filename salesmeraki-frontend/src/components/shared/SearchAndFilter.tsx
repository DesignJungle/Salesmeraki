'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface FilterOption {
  id: string;
  label: string;
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string[]>) => void;
  filterOptions: {
    [key: string]: FilterOption[];
  };
}

export default function SearchAndFilter({
  onSearch,
  onFilter,
  filterOptions,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleFilterChange = (category: string, value: string) => {
    setActiveFilters(prev => {
      const currentFilters = prev[category] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(v => v !== value)
        : [...currentFilters, value];

      return {
        ...prev,
        [category]: newFilters,
      };
    });
  };

  useEffect(() => {
    onFilter(activeFilters);
  }, [activeFilters, onFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Filters
        </button>
      </div>

      {isFiltersOpen && (
        <div className="p-4 border rounded-lg bg-white">
          {Object.entries(filterOptions).map(([category, options]) => (
            <div key={category} className="mb-4">
              <h3 className="font-medium mb-2">{category}</h3>
              <div className="space-y-2">
                {options.map((option) => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters[category]?.includes(option.id)}
                      onChange={() => handleFilterChange(category, option.id)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}