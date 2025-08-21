import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { Product, FilterOptions } from '../../types';
import ProductCard from './ProductCard';
import Filters from './Filters';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import Button from '../UI/Button';

const PartsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    vehicle: {
      make: searchParams.get('make') || undefined,
      model: searchParams.get('model') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    },
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.vehicle?.make) params.set('make', filters.vehicle.make);
    if (filters.vehicle?.model) params.set('model', filters.vehicle.model);
    if (filters.vehicle?.year) params.set('year', filters.vehicle.year.toString());
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts } = await FirestoreService.getProducts(filters);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const filteredProducts = products.filter(product =>
    searchQuery === '' ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== '');
    }
    return value !== undefined && value !== '';
  });

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-deep mb-4">
            Auto Parts Catalog
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect parts for your vehicle from our extensive collection
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search parts by name, brand, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                    Active
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, category: undefined })}
                    className="ml-2 hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.brand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white">
                  Brand: {filters.brand}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, brand: undefined })}
                    className="ml-2 hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.vehicle?.make && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white">
                  Make: {filters.vehicle.make}
                  <button
                    onClick={() => handleFiltersChange({
                      ...filters,
                      vehicle: { ...filters.vehicle, make: undefined }
                    })}
                    className="ml-2 hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Filters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon="search"
                title="No parts found"
                description="Try adjusting your search criteria or filters to find what you're looking for."
                action={
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear all filters
                  </Button>
                }
              />
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} of {products.length} parts
                  </p>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="relevance">Sort by Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>

                {/* Products Grid */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={viewMode === 'list' ? 'flex flex-row' : ''}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {filteredProducts.length >= 20 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Parts
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsList;