import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PGCard from '../common/PGCard';
import PGCardSkeleton from '../common/PGCardSkeleton';
import { 
  ArrowRightIcon, 
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon 
} from '@heroicons/react/24/outline';

const FeaturedPGs = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchFeaturedPGs();
  }, []);

  const fetchFeaturedPGs = async () => {
    try {
      const response = await axios.get('/api/pgs?limit=12&featured=true');
      setPgs(response.data.data.pgs || []);
    } catch (error) {
      console.error('Error fetching PGs:', error);
      // Set empty array on error
      setPgs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPGs = () => {
    if (filter === 'all') return pgs;
    return pgs.filter(pg => {
      switch (filter) {
        case 'boys': return pg.gender === 'boys';
        case 'girls': return pg.gender === 'girls';
        case 'budget': return pg.price <= 15000;
        case 'premium': return pg.price > 20000;
        default: return true;
      }
    });
  };

  const filteredPGs = filterPGs().slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-900 dark:to-dark-800">
        <div className="container-responsive px-4 sm:px-0">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-6 sm:h-8 bg-gray-300 dark:bg-dark-600 rounded-lg w-48 sm:w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-300 dark:bg-dark-600 rounded w-72 sm:w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <PGCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in px-4 sm:px-0">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            <span className="text-primary-700 dark:text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-wide">
              Featured Properties
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Discover Premium
            <span className="block text-gradient">PG Accommodations</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Handpicked properties offering the perfect blend of comfort, convenience, and community. 
            Each PG is verified and rated by our community.
          </p>
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0 px-4 sm:px-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-white dark:bg-dark-800 rounded-2xl p-2 shadow-lg w-full sm:w-auto">
            {[
              { key: 'all', label: 'All PGs', count: pgs.length },
              { key: 'boys', label: 'Boys', count: pgs.filter(pg => pg.gender === 'boys').length },
              { key: 'girls', label: 'Girls', count: pgs.filter(pg => pg.gender === 'girls').length },
              { key: 'budget', label: 'Budget', count: pgs.filter(pg => pg.price <= 15000).length },
              { key: 'premium', label: 'Premium', count: pgs.filter(pg => pg.price > 20000).length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-2 sm:px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm md:text-base transform hover:scale-[1.02] ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <span>{filterOption.label}</span>
                <span className="ml-1 text-xs opacity-75">({filterOption.count})</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-dark-800 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <ViewColumnsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* PG Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8' 
            : 'space-y-4 sm:space-y-6'
        } mb-8 sm:mb-12 px-4 sm:px-0`}>
          {filteredPGs.map((pg, index) => (
            <div
              key={pg._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PGCard pg={pg} viewMode={viewMode} />
            </div>
          ))}
        </div>

        {/* Load More / View All */}
        <div className="text-center px-4 sm:px-0">
          {visibleCount < filterPGs().length ? (
            <button
              onClick={loadMore}
              className="btn btn-outline btn-lg mb-4 sm:mb-6 transform hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
            >
              Load More Properties
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          ) : null}
          
          <Link
            to="/listings"
            className="btn btn-primary btn-lg sm:btn-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
          >
            View All {pgs.length}+ Properties
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPGs;