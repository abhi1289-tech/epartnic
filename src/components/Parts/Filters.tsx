import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions } from '../../types';
import Button from '../UI/Button';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    vehicle: true,
  });

  const categories = [
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Electrical',
    'Body Parts',
    'Interior',
    'Filters',
    'Belts & Hoses',
    'Lighting',
    'Exhaust System',
  ];

  const brands = [
    'Bosch',
    'Mahle',
    'Valeo',
    'Continental',
    'NGK',
    'Denso',
    'Monroe',
    'Gates',
    'Hella',
    'Mann-Filter',
  ];

  const vehicleMakes = [
    'Maruti Suzuki',
    'Hyundai',
    'Tata',
    'Mahindra',
    'Honda',
    'Toyota',
    'Ford',
    'Volkswagen',
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== '');
    }
    return value !== undefined && value !== '';
  });

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full justify-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
              Active
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`${className} ${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-deep flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Category Filter */}
            <div>
              <button
                onClick={() => toggleSection('category')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">Category</h4>
                {expandedSections.category ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {expandedSections.category && (
                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => updateFilters({ category: e.target.value })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                  {filters.category && (
                    <button
                      onClick={() => updateFilters({ category: undefined })}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Clear category
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div>
              <button
                onClick={() => toggleSection('brand')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">Brand</h4>
                {expandedSections.brand ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {expandedSections.brand && (
                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={filters.brand === brand}
                        onChange={(e) => updateFilters({ brand: e.target.value })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                  {filters.brand && (
                    <button
                      onClick={() => updateFilters({ brand: undefined })}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Clear brand
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">Price Range</h4>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {expandedSections.price && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.[0] || ''}
                      onChange={(e) => {
                        const min = e.target.value ? parseInt(e.target.value) : undefined;
                        const max = filters.priceRange?.[1];
                        updateFilters({ priceRange: min !== undefined || max !== undefined ? [min || 0, max || 999999] : undefined });
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.[1] || ''}
                      onChange={(e) => {
                        const max = e.target.value ? parseInt(e.target.value) : undefined;
                        const min = filters.priceRange?.[0];
                        updateFilters({ priceRange: min !== undefined || max !== undefined ? [min || 0, max || 999999] : undefined });
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Preset Price Ranges */}
                  <div className="space-y-2">
                    {[
                      [0, 1000],
                      [1000, 5000],
                      [5000, 10000],
                      [10000, 25000],
                      [25000, 999999],
                    ].map(([min, max]) => (
                      <label key={`${min}-${max}`} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange?.[0] === min && filters.priceRange?.[1] === max}
                          onChange={() => updateFilters({ priceRange: [min, max] })}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          ₹{min.toLocaleString()} - {max === 999999 ? '₹25000+' : `₹${max.toLocaleString()}`}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  {filters.priceRange && (
                    <button
                      onClick={() => updateFilters({ priceRange: undefined })}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Clear price range
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Vehicle Filter */}
            <div>
              <button
                onClick={() => toggleSection('vehicle')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900">Vehicle</h4>
                {expandedSections.vehicle ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {expandedSections.vehicle && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <select
                      value={filters.vehicle?.make || ''}
                      onChange={(e) => updateFilters({
                        vehicle: {
                          ...filters.vehicle,
                          make: e.target.value || undefined,
                        }
                      })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Makes</option>
                      {vehicleMakes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="From"
                        value={filters.vehicle?.year || ''}
                        onChange={(e) => updateFilters({
                          vehicle: {
                            ...filters.vehicle,
                            year: e.target.value ? parseInt(e.target.value) : undefined,
                          }
                        })}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="To"
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {(filters.vehicle?.make || filters.vehicle?.year) && (
                    <button
                      onClick={() => updateFilters({ vehicle: undefined })}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Clear vehicle filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;