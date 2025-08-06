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
  
  const [allPgs, setAllPgs] = useState([]); // Store all PGs from API
  const [displayedPgs, setDisplayedPgs] = useState([]); // PGs currently displayed
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [sortBy, setSortBy] = useState('createdAt');
  const [displayCount, setDisplayCount] = useState(3); // Number of cards to display
  const [loadIncrement] = useState(3); // Load 3 more cards each time
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
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
    { value: 'createdAt', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'price_low', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
    { value: 'price_high', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
    { value: 'name', label: 'Name A-Z', sortBy: 'name', sortOrder: 'asc' },
    { value: 'name_desc', label: 'Name Z-A', sortBy: 'name', sortOrder: 'desc' }
  ];

  // Sync filters with URL parameters on mount and URL changes
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      gender: searchParams.get('gender') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
      roomType: searchParams.get('roomType') || '',
      verified: searchParams.get('verified') === 'true',
      instantBook: searchParams.get('instantBook') === 'true'
    };
    
    setFilters(urlFilters);
    setAppliedFilters(urlFilters);
  }, [searchParams]);

  // Cleanup on unmount (no longer needed for debounce timeouts)
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    fetchPGs(true); // Fetch all pages initially
  }, [searchParams, sortBy]);

  const fetchPGs = async (loadAllPages = false) => {
    setLoading(true);
    
    try {
      // Get current filters from URL params - only backend filters
      const backendFilters = {
        search: searchParams.get('search') || '',
        city: searchParams.get('city') || '',
        gender: searchParams.get('gender') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || []
      };

      let allFetchedPGs = [];
      let currentPage = 1;
      let hasMoreData = true;

      // Fetch all pages of data from backend
      while (hasMoreData && (loadAllPages || currentPage === 1)) {
        // Build query parameters for API call - only backend filters
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20' // Fetch more records per request
        });

        // Add backend filters to query params
        if (backendFilters.search) queryParams.set('search', backendFilters.search);
        if (backendFilters.city) queryParams.set('city', backendFilters.city);
        if (backendFilters.gender && backendFilters.gender !== '') queryParams.set('gender', backendFilters.gender);
        if (backendFilters.minPrice) queryParams.set('minPrice', backendFilters.minPrice);
        if (backendFilters.maxPrice) queryParams.set('maxPrice', backendFilters.maxPrice);
        if (backendFilters.amenities.length > 0) queryParams.set('amenities', backendFilters.amenities.join(','));

        // Add sorting
        const selectedSort = sortOptions.find(opt => opt.value === sortBy);
        if (selectedSort) {
          queryParams.set('sortBy', selectedSort.sortBy);
          queryParams.set('sortOrder', selectedSort.sortOrder);
        }

        // Make API call to backend
        const response = await axios.get(`/api/pgs?${queryParams.toString()}`);
        
        if (response.data.success) {
          const { pgs = [], hasMore = false } = response.data.data || {};
          allFetchedPGs = [...allFetchedPGs, ...pgs];
          hasMoreData = hasMore && loadAllPages;
          currentPage++;
        } else {
          console.error('API response error:', response.data.message);
          break;
        }
      }

      // Apply frontend-only filters after getting all backend results
      const frontendFilters = {
        roomType: searchParams.get('roomType') || '',
        verified: searchParams.get('verified') === 'true',
        instantBook: searchParams.get('instantBook') === 'true'
      };

      // Filter PGs on frontend for roomType, verified, instantBook
      const filteredPGs = allFetchedPGs.filter(pg => {
        // Room Type filter (frontend only)
        if (frontendFilters.roomType && pg.roomType !== frontendFilters.roomType) {
          return false;
        }

        // Verified filter (frontend only)
        if (frontendFilters.verified && !pg.verified) {
          return false;
        }

        // Instant Book filter (frontend only)
        if (frontendFilters.instantBook && !pg.instantBook) {
          return false;
        }

        return true;
      });

      // Store all PGs and reset display count
      setAllPgs(filteredPGs);
      setDisplayCount(3);
      setDisplayedPgs(filteredPGs.slice(0, 3));
      
      // Update pagination state
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(filteredPGs.length / 3),
        total: filteredPGs.length,
        hasMore: filteredPGs.length > 3
      });

    } catch (error) {
      console.error('Error fetching PGs:', error);
      // Fallback: show empty state or error message
      setAllPgs([]);
      setDisplayedPgs([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasMore: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Note: Filters are no longer auto-applied. User must click "Apply Filters" button.
  };

  const applyFiltersImmediately = (filtersToApply) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filtersToApply).forEach(([filterKey, filterValue]) => {
        if (filterKey === 'amenities') {
          if (filterValue && Array.isArray(filterValue) && filterValue.length > 0) {
            params.set(filterKey, filterValue.join(','));
          }
        } else if (typeof filterValue === 'boolean') {
          if (filterValue === true) {
            params.set(filterKey, 'true');
          }
        } else if (filterValue && filterValue.toString().trim() !== '') {
          params.set(filterKey, filterValue.toString().trim());
        }
      });
      
      setSearchParams(params);
      setAppliedFilters(filtersToApply);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    // Note: Amenities are no longer auto-applied. User must click "Apply Filters" button.
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = {
      ...filters,
      minPrice: range.min.toString(),
      maxPrice: range.max.toString()
    };
    
    setFilters(newFilters);
    // Note: Price range is no longer auto-applied. User must click "Apply Filters" button.
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'amenities') {
        if (value && Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        }
      } else if (typeof value === 'boolean') {
        if (value === true) {
          params.set(key, 'true');
        }
      } else if (value && value.toString().trim() !== '') {
        params.set(key, value.toString().trim());
      }
    });
    
    setSearchParams(params);
    setAppliedFilters({...filters});
    setShowFilters(false);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
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
    return Object.entries(appliedFilters).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      } else if (typeof value === 'boolean') {
        return value === true;
      } else if (typeof value === 'string') {
        return value.trim() !== '';
      }
      return false;
    }).length;
  };

  const hasUnappliedChanges = () => {
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  };

  const loadMore = () => {
    if (displayCount < allPgs.length && !loadingMore) {
      setLoadingMore(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const newDisplayCount = Math.min(displayCount + loadIncrement, allPgs.length);
        setDisplayCount(newDisplayCount);
        setDisplayedPgs(allPgs.slice(0, newDisplayCount));
        
        // Update pagination state
        setPagination(prev => ({
          ...prev,
          hasMore: newDisplayCount < allPgs.length
        }));
        
        setLoadingMore(false);
      }, 800); // 800ms delay for loading effect
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="container-responsive py-6 lg:py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
            <div>
              <div className="h-6 lg:h-8 bg-gray-300 dark:bg-dark-600 rounded w-64 lg:w-80 mb-2 animate-pulse"></div>
              <div className="h-3 lg:h-4 bg-gray-300 dark:bg-dark-600 rounded w-40 lg:w-48 animate-pulse"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-8 lg:h-10 bg-gray-300 dark:bg-dark-600 rounded w-32 lg:w-40 animate-pulse"></div>
              <div className="h-8 lg:h-10 bg-gray-300 dark:bg-dark-600 rounded w-20 lg:w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Grid - Show 3 cards initially */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-40 lg:h-48 bg-gray-300 dark:bg-dark-600 rounded-t-lg"></div>
                <div className="p-4 lg:p-6">
                  <div className="h-3 lg:h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-2 lg:h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/2 mb-3 lg:mb-4 animate-pulse"></div>
                  <div className="h-5 lg:h-6 bg-gray-300 dark:bg-dark-600 rounded w-1/4 animate-pulse"></div>
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
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-6 md:mb-8 space-y-4 xl:space-y-0">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {appliedFilters.search ? `Search results for "${appliedFilters.search}"` : 
               appliedFilters.city ? `PGs in ${appliedFilters.city}` : 
               'All PG Listings'}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
                {allPgs.length} {allPgs.length === 1 ? 'property' : 'properties'} found
              </p>
              {getActiveFiltersCount() > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 w-fit">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full sm:min-w-40 lg:min-w-48"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-dark-800 rounded-xl p-1 shadow-md w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 flex-1 sm:flex-none ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 flex-1 sm:flex-none ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all duration-300 flex-1 sm:flex-none ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center justify-center space-x-2 w-full sm:w-auto hover:!scale-[1.02] transition-transform duration-300"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`xl:w-80 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="card p-4 lg:p-6 xl:sticky xl:top-24 animate-slide-right">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Backend Filters */}
                <div className="space-y-6 pb-6 border-b border-gray-200 dark:border-dark-600">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    🔍 Search & Location (Backend Filters)
                  </h4>
                  
                  {/* Global Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      🔍 Search PGs
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search PGs, locations..."
                        className="input pl-10"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      📍 Specific Location
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter city name"
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
                          className={`p-2 lg:p-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                            filters.gender === option.value
                              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg'
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
                      onChange={handlePriceRangeChange}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ✨ Amenities
                    </label>
                    <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto scrollbar-thin">
                      {amenityOptions.map((amenity) => (
                        <label 
                          key={amenity.value} 
                          className="flex items-center space-x-3 p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.value)}
                            onChange={() => handleAmenityToggle(amenity.value)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-lg">{amenity.icon}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {amenity.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Frontend Filters */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                    ⚡ Quick Filters (Frontend Only)
                  </h4>
                  
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

                  {/* Special Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ⭐ Special Features
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.verified}
                          onChange={(e) => handleFilterChange('verified', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-lg">✅</span>
                        <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">
                          Verified Only
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.instantBook}
                          onChange={(e) => handleFilterChange('instantBook', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-lg">⚡</span>
                        <span className="text-sm lg:text-base text-gray-700 dark:text-gray-300 font-medium">
                          Instant Booking
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <button
                    onClick={applyFilters}
                    className={`btn w-full ${hasUnappliedChanges() ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {hasUnappliedChanges() ? 'Apply Filters' : 'Filters Applied'}
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
                    // Filter out empty, false, or null values
                    if (Array.isArray(value) && value.length === 0) return null;
                    if (typeof value === 'boolean' && value === false) return null;
                    if (typeof value === 'string' && value.trim() === '') return null;
                    if (!value) return null;
                    
                    let displayValue = value;
                    let displayKey = key;
                    
                    // Format display values
                    if (key === 'amenities') {
                      displayValue = `${value.length} amenities`;
                      displayKey = 'Amenities';
                    } else if (key === 'minPrice') {
                      displayValue = `₹${parseInt(value).toLocaleString()}+`;
                      displayKey = 'Min Price';
                    } else if (key === 'maxPrice') {
                      displayValue = `₹${parseInt(value).toLocaleString()}-`;
                      displayKey = 'Max Price';
                    } else if (key === 'roomType') {
                      displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                      displayKey = 'Room Type';
                    } else if (key === 'instantBook') {
                      displayValue = 'Instant Book';
                      displayKey = '';
                    } else if (key === 'verified') {
                      displayValue = 'Verified Only';
                      displayKey = '';
                    } else {
                      displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                    }
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      >
                        {displayKey ? `${displayKey}: ${displayValue}` : displayValue}
                        <button
                          onClick={() => {
                            let newFilters;
                            if (key === 'amenities') {
                              newFilters = { ...filters, [key]: [] };
                            } else if (typeof value === 'boolean') {
                              newFilters = { ...filters, [key]: false };
                            } else {
                              newFilters = { ...filters, [key]: '' };
                            }
                            setFilters(newFilters);
                            
                            // Apply the filter removal immediately
                            const params = new URLSearchParams();
                            Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
                              if (filterKey === 'amenities') {
                                if (filterValue && Array.isArray(filterValue) && filterValue.length > 0) {
                                  params.set(filterKey, filterValue.join(','));
                                }
                              } else if (typeof filterValue === 'boolean') {
                                if (filterValue === true) {
                                  params.set(filterKey, 'true');
                                }
                              } else if (filterValue && filterValue.toString().trim() !== '') {
                                params.set(filterKey, filterValue.toString().trim());
                              }
                            });
                            setSearchParams(params);
                            setAppliedFilters(newFilters);
                          }}
                          className="ml-2 hover:text-purple-600 dark:hover:text-purple-400"
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
            {displayedPgs.length === 0 ? (
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
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6' 
                    : 'space-y-4 lg:space-y-6'
                } mb-6 lg:mb-8`}>
                  {displayedPgs.map((pg, index) => (
                    <div
                      key={pg._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PGCard pg={pg} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center animate-fade-in mb-6 lg:mb-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore || displayCount >= allPgs.length}
                    className={`font-semibold py-3 px-6 lg:py-4 lg:px-8 rounded-xl shadow-lg transform transition-all duration-300 w-full sm:w-auto ${
                      displayCount >= allPgs.length
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white hover:!scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none'
                    }`}
                  >
                    {loadingMore ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span className="text-sm lg:text-base">Loading more PGs...</span>
                      </div>
                    ) : displayCount >= allPgs.length ? (
                      <span className="text-sm lg:text-base">All PGs Loaded</span>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-center">
                        <span className="text-sm lg:text-base">Load More PGs</span>
                        <span className="sm:ml-3 mt-1 sm:mt-0 text-xs lg:text-sm opacity-90 bg-white/20 px-2 py-1 rounded-full">
                          {allPgs.length - displayCount} remaining
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Results Summary */}
                <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                  <p className="text-sm">
                    Showing {displayedPgs.length} of {allPgs.length} properties
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Overlay for Mobile */}
      {showFilters && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-dark-800 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Mobile filter content - same as sidebar but with full mobile optimization */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Apply and Clear buttons at top for mobile */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={applyFilters}
                  className={`flex-1 text-sm ${hasUnappliedChanges() ? 'btn btn-primary' : 'btn btn-secondary'}`}
                >
                  {hasUnappliedChanges() ? 'Apply Filters' : 'Filters Applied'}
                </button>
                
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="btn btn-ghost flex-1 text-sm"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Backend Filters */}
                <div className="space-y-6 pb-6 border-b border-gray-200 dark:border-dark-600">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    🔍 Search & Location (Backend Filters)
                  </h4>
                  
                  {/* Global Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      🔍 Search PGs
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search PGs, locations..."
                        className="input pl-10"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      📍 Specific Location
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter city name"
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
                          className={`p-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            filters.gender === option.value
                              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg'
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
                      onChange={handlePriceRangeChange}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ✨ Amenities
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                      {amenityOptions.map((amenity) => (
                        <label 
                          key={amenity.value} 
                          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.value)}
                            onChange={() => handleAmenityToggle(amenity.value)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-lg">{amenity.icon}</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {amenity.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Frontend Filters */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                    ⚡ Quick Filters (Frontend Only)
                  </h4>
                  
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

                  {/* Special Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ⭐ Special Features
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.verified}
                          onChange={(e) => handleFilterChange('verified', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-lg">✅</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          Verified Only
                        </span>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.instantBook}
                          onChange={(e) => handleFilterChange('instantBook', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-lg">⚡</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          Instant Booking
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;