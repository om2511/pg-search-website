import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const SearchAutocomplete = ({ onSearch, placeholder = "Search PGs, locations..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));

    // Load popular locations
    fetchPopularLocations();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/pgs/suggestions?q=${query}`);
          setSuggestions(response.data.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(query.length === 0);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchPopularLocations = async () => {
    try {
      const response = await axios.get('/api/pgs/popular-locations');
      setPopularLocations(response.data.data || []);
    } catch (error) {
      // Fallback to static popular locations
      setPopularLocations([
        { city: 'Mumbai', count: 156 },
        { city: 'Bangalore', count: 89 },
        { city: 'Pune', count: 67 },
        { city: 'Delhi', count: 45 },
        { city: 'Hyderabad', count: 34 }
      ]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchData = typeof suggestion === 'string' 
      ? { query: suggestion }
      : { city: suggestion.city };
    
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const newRecent = [searchData.city || searchData.query, ...recent.filter(item => item !== (searchData.city || searchData.query))].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    setQuery(searchData.city || searchData.query || '');
    setShowSuggestions(false);
    onSearch(searchData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSuggestionClick(query.trim());
    }
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 border border-gray-200 dark:border-dark-600 rounded-2xl bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowSuggestions(true);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-600 max-h-96 overflow-y-auto scrollbar-thin animate-slide-down">
          {loading ? (
            <div className="p-6 text-center">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
            </div>
          ) : query.length > 2 && suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Search Results
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-dark-700 transition-colors flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-xl flex items-center justify-center">
                    {suggestion.type === 'city' ? (
                      <MapPinIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <BuildingOfficeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {suggestion.name || suggestion.city}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestion.type === 'city' 
                        ? `${suggestion.count} PGs available`
                        : `${suggestion.location?.city}, ${suggestion.location?.state}`
                      }
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-dark-700 transition-colors flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-dark-700 rounded-xl flex items-center justify-center">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {search}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Locations */}
              {popularLocations.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center space-x-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    <span>Popular Locations</span>
                  </div>
                  {popularLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(location)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-dark-700 transition-colors flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-accent-100 to-warning-100 dark:from-accent-900 dark:to-warning-900 rounded-xl flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {location.city}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {location.count} PGs available
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;