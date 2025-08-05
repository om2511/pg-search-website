import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PGCard from '../components/common/PGCard';
import PriceRangeSlider from '../components/common/PriceRangeSlider';
import { 
  FunnelIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ArrowPathIcon,
  MapIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [sortBy, setSortBy] = useState('newest');
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false
  });

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    gender: searchParams.get('gender') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    roomType: searchParams.get('roomType') || '',
    verified: searchParams.get('verified') === 'true',
    instantBook: searchParams.get('instantBook') === 'true'
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const amenityOptions = [
    { value: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { value: 'ac', label: 'AC', icon: '❄️' },
    { value: 'tv', label: 'TV', icon: '📺' },
    { value: 'fridge', label: 'Fridge', icon: '🧊' },
    { value: 'washing_machine', label: 'Washing Machine', icon: '👕' },
    { value: 'parking', label: 'Parking', icon: '🚗' },
    { value: 'security', label: 'Security', icon: '🔒' },
    { value: 'meals', label: 'Meals', icon: '🍽️' },
    { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { value: 'gym', label: 'Gym', icon: '💪' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  useEffect(() => {
    fetchPGs(1, true);
  }, [searchParams, sortBy]);

  const fetchPGs = async (page = 1, reset = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      params.set('limit', '8');
      params.set('sort', sortBy);
      
      const response = await axios.get(`/api/pgs?${params.toString()}`);
      const newPGs = response.data.data.pgs || [];
      
      if (reset || page === 1) {
        setPgs(newPGs);
      } else {
        setPgs(prev => [...prev, ...newPGs]);
      }
      
      setPagination({
        currentPage: response.data.data.currentPage || page,
        totalPages: response.data.data.totalPages || 1,
        total: response.data.data.total || 0,
        hasMore: (response.data.data.currentPage || page) < (response.data.data.totalPages || 1)
      });
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters(prev => ({ ...prev, amenities: newAmenities }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        if (key === 'amenities') {
          params.set(key, value.join(','));
        } else if (typeof value === 'boolean') {
          if (value) params.set(key, 'true');
        } else {
          params.set(key, value);
        }
      }
    });
    
    setSearchParams(params);
    setAppliedFilters({...filters});
    setShowFilters(false);
  };

  const clearFilters = () => {
    const newFilters = {
      city: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      roomType: '',
      verified: false,
      instantBook: false
    };
    setFilters(newFilters);
    setSearchParams({});
    setAppliedFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(appliedFilters).filter(value => 
      value && 
      (Array.isArray(value) ? value.length > 0 : value !== '' && value !== false)
    ).length;
  };

  const loadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchPGs(pagination.currentPage + 1, false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="container-responsive py-8">
          {/* Skeleton Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-300 dark:bg-dark-600 rounded w-24 animate-pulse"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-dark-600"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {filters.city ? `PGs in ${filters.city}` : 'All PG Listings'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {pagination.total} properties found
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input min-w-48"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-dark-800 rounded-xl p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center space-x-2"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6 sticky top-24 animate-slide-right">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🔍 Search Location
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City, area, or PG name"
                      className="input pl-10"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                    />
                  </div>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    👥 Gender Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '', label: 'Any' },
                      { value: 'boys', label: 'Boys' },
                      { value: 'girls', label: 'Girls' },
                      { value: 'both', label: 'Co-ed' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('gender', option.value)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          filters.gender === option.value
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    💰 Price Range
                  </label>
                  <PriceRangeSlider
                    min={5000}
                    max={50000}
                    value={{ min: parseInt(filters.minPrice) || 5000, max: parseInt(filters.maxPrice) || 50000 }}
                    onChange={(range) => {
                      handleFilterChange('minPrice', range.min.toString());
                      handleFilterChange('maxPrice', range.max.toString());
                    }}
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🏠 Room Type
                  </label>
                  <select
                    className="input"
                    value={filters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  >
                    <option value="">Any Room Type</option>
                    <option value="single">Single Occupancy</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="dormitory">Dormitory</option>
                  </select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    ✨ Amenities
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {amenityOptions.map((amenity) => (
                      <label 
                        key={amenity.value} 
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.value)}
                          onChange={() => handleAmenityToggle(amenity.value)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-lg">{amenity.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    ⭐ Special Features
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => handleFilterChange('verified', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-lg">✅</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Verified Only
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.instantBook}
                        onChange={(e) => handleFilterChange('instantBook', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-lg">⚡</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Instant Booking
                      </span>
                    </label>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <button
                    onClick={applyFilters}
                    className="btn btn-primary w-full"
                  >
                    Apply Filters
                  </button>
                  
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="btn btn-ghost w-full flex items-center justify-center"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6 animate-slide-down">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                    Active filters:
                  </span>
                  
                  {Object.entries(appliedFilters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0) || value === false) return null;
                    
                    let displayValue = value;
                    if (key === 'amenities') {
                      displayValue = `${value.length} amenities`;
                    } else if (key === 'minPrice' || key === 'maxPrice') {
                      displayValue = `₹${parseInt(value).toLocaleString()}`;
                    } else if (typeof value === 'boolean') {
                      displayValue = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                      >
                        {key}: {displayValue}
                        <button
                          onClick={() => {
                            if (key === 'amenities') {
                              handleFilterChange(key, []);
                            } else if (typeof value === 'boolean') {
                              handleFilterChange(key, false);
                            } else {
                              handleFilterChange(key, '');
                            }
                            applyFilters();
                          }}
                          className="ml-2 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results */}
            {pgs.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No PGs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any PGs matching your criteria. Try adjusting your filters or search in a different location.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => navigate('/listings')}
                    className="btn btn-primary"
                  >
                    View All PGs
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* PG Grid/List */}
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6' 
                    : 'space-y-6'
                } mb-8`}>
                  {pgs.map((pg, index) => (
                    <div
                      key={pg._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PGCard pg={pg} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="text-center animate-fade-in">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="btn btn-outline btn-lg px-12"
                    >
                      {loadingMore ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Loading more...
                        </div>
                      ) : (
                        <>
                          Load More PGs
                          <span className="ml-2 text-sm opacity-75">
                            ({pagination.total - pgs.length} remaining)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Results Summary */}
                <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                  Showing {pgs.length} of {pagination.total} properties
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Overlay for Mobile */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-dark-800 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Mobile filter content would go here - same as sidebar */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;