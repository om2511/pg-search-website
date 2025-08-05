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
  const [sortBy, setSortBy] = useState('createdAt');
  
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

  // Mock data for demonstration - 8 PG cards total
  const mockPGsData = [
    {
      _id: '1',
      name: 'Sunshine Residency',
      location: { city: 'Mumbai', state: 'Maharashtra', area: 'Andheri West' },
      price: 15000,
      gender: 'both',
      roomType: 'double',
      amenities: ['wifi', 'ac', 'meals', 'security', 'parking'],
      availableRooms: 3,
      verified: true,
      instantBook: true,
      rating: 4.5,
      images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Green Valley PG',
      location: { city: 'Bangalore', state: 'Karnataka', area: 'Koramangala' },
      price: 12000,
      gender: 'girls',
      roomType: 'single',
      amenities: ['wifi', 'tv', 'fridge', 'washing_machine', 'cleaning'],
      availableRooms: 2,
      verified: true,
      instantBook: false,
      rating: 4.2,
      images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-10'
    },
    {
      _id: '3',
      name: 'Royal Comfort PG',
      location: { city: 'Pune', state: 'Maharashtra', area: 'Kothrud' },
      price: 18000,
      gender: 'boys',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'gym', 'security', 'parking', 'meals'],
      availableRooms: 5,
      verified: true,
      instantBook: true,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-20'
    },
    {
      _id: '4',
      name: 'Elite Hostel',
      location: { city: 'Delhi', state: 'Delhi', area: 'Lajpat Nagar' },
      price: 22000,
      gender: 'both',
      roomType: 'triple',
      amenities: ['wifi', 'ac', 'tv', 'fridge', 'security', 'cleaning'],
      availableRooms: 8,
      verified: false,
      instantBook: true,
      rating: 4.0,
      images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-25'
    },
    {
      _id: '5',
      name: 'Metro Stay PG',
      location: { city: 'Hyderabad', state: 'Telangana', area: 'Gachibowli' },
      price: 14000,
      gender: 'girls',
      roomType: 'double',
      amenities: ['wifi', 'tv', 'washing_machine', 'security', 'parking'],
      availableRooms: 4,
      verified: true,
      instantBook: false,
      rating: 4.3,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-12'
    },
    {
      _id: '6',
      name: 'Ocean View Residency',
      location: { city: 'Chennai', state: 'Tamil Nadu', area: 'Adyar' },
      price: 16000,
      gender: 'both',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'meals', 'gym', 'security'],
      availableRooms: 6,
      verified: true,
      instantBook: true,
      rating: 4.6,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-08'
    },
    {
      _id: '7',
      name: 'Smart Living PG',
      location: { city: 'Mumbai', state: 'Maharashtra', area: 'Bandra' },
      price: 20000,
      gender: 'boys',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'tv', 'fridge', 'gym', 'parking'],
      availableRooms: 3,
      verified: true,
      instantBook: true,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-30'
    },
    {
      _id: '8',
      name: 'Budget Friendly PG',
      location: { city: 'Bangalore', state: 'Karnataka', area: 'BTM Layout' },
      price: 9000,
      gender: 'girls',
      roomType: 'triple',
      amenities: ['wifi', 'washing_machine', 'security', 'meals'],
      availableRooms: 7,
      verified: false,
      instantBook: false,
      rating: 3.8,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      createdAt: '2024-01-05'
    }
  ];

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
    fetchPGs(1, true);
  }, [searchParams, sortBy]);

  const fetchPGs = async (page = 1, reset = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get current filters from URL params
      const currentFilters = {
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

      // Filter mock data based on current filters
      let filteredPGs = [...mockPGsData];

      // Apply search filter
      if (currentFilters.search && currentFilters.search.trim() !== '') {
        const searchTerm = currentFilters.search.toLowerCase().trim();
        filteredPGs = filteredPGs.filter(pg => 
          pg.name.toLowerCase().includes(searchTerm) ||
          pg.location.city.toLowerCase().includes(searchTerm) ||
          pg.location.area.toLowerCase().includes(searchTerm) ||
          pg.location.state.toLowerCase().includes(searchTerm)
        );
      }

      // Apply city filter
      if (currentFilters.city && currentFilters.city.trim() !== '') {
        const cityTerm = currentFilters.city.toLowerCase().trim();
        filteredPGs = filteredPGs.filter(pg => 
          pg.location.city.toLowerCase().includes(cityTerm)
        );
      }

      // Apply gender filter
      if (currentFilters.gender && currentFilters.gender.trim() !== '' && currentFilters.gender !== 'any') {
        filteredPGs = filteredPGs.filter(pg => 
          pg.gender === currentFilters.gender || pg.gender === 'both'
        );
      }

      // Apply price range filter
      if (currentFilters.minPrice && !isNaN(parseInt(currentFilters.minPrice))) {
        const minPrice = parseInt(currentFilters.minPrice);
        filteredPGs = filteredPGs.filter(pg => pg.price >= minPrice);
      }
      if (currentFilters.maxPrice && !isNaN(parseInt(currentFilters.maxPrice))) {
        const maxPrice = parseInt(currentFilters.maxPrice);
        filteredPGs = filteredPGs.filter(pg => pg.price <= maxPrice);
      }

      // Apply amenities filter
      if (currentFilters.amenities && currentFilters.amenities.length > 0) {
        filteredPGs = filteredPGs.filter(pg => 
          currentFilters.amenities.every(amenity => pg.amenities.includes(amenity))
        );
      }

      // Apply room type filter
      if (currentFilters.roomType && currentFilters.roomType.trim() !== '') {
        filteredPGs = filteredPGs.filter(pg => pg.roomType === currentFilters.roomType.trim());
      }

      // Apply verified filter
      if (currentFilters.verified) {
        filteredPGs = filteredPGs.filter(pg => pg.verified === true);
      }

      // Apply instant book filter
      if (currentFilters.instantBook) {
        filteredPGs = filteredPGs.filter(pg => pg.instantBook === true);
      }

      // Sort the filtered results
      const selectedSort = sortOptions.find(opt => opt.value === sortBy);
      if (selectedSort) {
        filteredPGs.sort((a, b) => {
          switch (selectedSort.sortBy) {
            case 'price':
              return selectedSort.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            case 'rating':
              return selectedSort.sortOrder === 'asc' ? 
                (a.rating || 0) - (b.rating || 0) : 
                (b.rating || 0) - (a.rating || 0);
            case 'name':
              return selectedSort.sortOrder === 'asc' ? 
                a.name.localeCompare(b.name) : 
                b.name.localeCompare(a.name);
            case 'createdAt':
            default:
              return selectedSort.sortOrder === 'asc' ? 
                new Date(a.createdAt) - new Date(b.createdAt) : 
                new Date(b.createdAt) - new Date(a.createdAt);
          }
        });
      }

      // Implement pagination - 3 cards per page
      const itemsPerPage = 3;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedPGs = filteredPGs.slice(startIndex, endIndex);

      const totalPages = Math.ceil(filteredPGs.length / itemsPerPage);
      const hasMore = page < totalPages;

      if (reset || page === 1) {
        setPgs(paginatedPGs);
      } else {
        setPgs(prev => [...prev, ...paginatedPGs]);
      }
      
      setPagination({
        currentPage: page,
        totalPages,
        total: filteredPGs.length,
        hasMore
      });
    } catch (error) {
      console.error('Error fetching PGs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
    if (pagination.hasMore && !loadingMore) {
      fetchPGs(pagination.currentPage + 1, false);
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

          {/* Skeleton Grid */}
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
                {pagination.total} {pagination.total === 1 ? 'property' : 'properties'} found
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
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6' 
                    : 'space-y-4 lg:space-y-6'
                } mb-6 lg:mb-8`}>
                  {pgs.map((pg, index) => (
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
                {pagination.hasMore && (
                  <div className="text-center animate-fade-in mb-6 lg:mb-8">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 lg:py-4 lg:px-8 rounded-xl shadow-lg transform hover:!scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                    >
                      {loadingMore ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                          <span className="text-sm lg:text-base">Loading more PGs...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-center">
                          <span className="text-sm lg:text-base">Load More PGs</span>
                          <span className="sm:ml-3 mt-1 sm:mt-0 text-xs lg:text-sm opacity-90 bg-white/20 px-2 py-1 rounded-full">
                            {pagination.total - pgs.length} remaining
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Results Summary */}
                <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                  <p className="text-sm">
                    Showing {pgs.length} of {pagination.total} properties
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
      )}
    </div>
  );
};

export default Listings;