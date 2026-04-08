import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import PGCard from '../components/common/PGCard';
import {
  HeartIcon,
  TrashIcon,
  ShareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Wishlist = () => {
  const { wishlist, loading, clearWishlist } = useWishlist();
  const [wishlistPGs, setWishlistPGs] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const fetchWishlistPGs = useCallback(async () => {
    try {
      // For authenticated users, wishlist contains full PG objects from API
      setWishlistPGs(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist PGs:', error);
    } finally {
      setFetchLoading(false);
    }
  }, [wishlist]);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistPGs();
    } else {
      setFetchLoading(false);
    }
  }, [wishlist, fetchWishlistPGs]);

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  const handleShare = () => {
    const shareData = {
      title: 'My PG Wishlist',
      text: `Check out my saved PG accommodations on FindMyPG`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getSortedAndFilteredPGs = () => {
    let filtered = [...wishlistPGs];

    // Apply filters
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'boys':
          filtered = filtered.filter(pg => pg.gender === 'boys');
          break;
        case 'girls':
          filtered = filtered.filter(pg => pg.gender === 'girls');
          break;
        case 'budget':
          filtered = filtered.filter(pg => pg.price <= 15000);
          break;
        case 'premium':
          filtered = filtered.filter(pg => pg.price > 20000);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const filteredPGs = getSortedAndFilteredPGs();

  if (loading || fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-4 sm:py-6 lg:py-8">
      <div className="container-responsive px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
          <div className="animate-fade-in mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <HeartSolidIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              {wishlistPGs.length} saved {wishlistPGs.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
          
          {wishlistPGs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="btn btn-outline flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Share Wishlist</span>
                <span className="sm:hidden">Share</span>
              </button>
              
              <button
                onClick={handleClearWishlist}
                className="btn btn-ghost text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
            </div>
          )}
        </div>

        {wishlistPGs.length === 0 ? (
          // Empty State
          <div className="text-center py-12 sm:py-16 animate-fade-in px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-dark-700 dark:to-dark-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Start exploring and save PGs you love. Click the heart icon on any PG to add it to your wishlist.
            </p>
            <div className="space-y-4">
              <Link to="/listings" className="btn btn-primary btn-lg w-full sm:w-auto">
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Explore PGs
              </Link>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                💡 Tip: Save PGs to compare prices and amenities later
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 sm:mb-8 gap-4">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 w-full sm:w-auto">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="input w-full xs:w-auto text-sm sm:text-base"
                >
                  <option value="all">All Properties</option>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="budget">Budget (Under ₹15k)</option>
                  <option value="premium">Premium (Above ₹20k)</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input w-full xs:w-auto text-sm sm:text-base"
                >
                  <option value="newest">Recently Added</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto text-center sm:text-right">
                Showing {filteredPGs.length} of {wishlistPGs.length} properties
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredPGs.map((pg, index) => (
                <div
                  key={pg._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PGCard pg={pg} />
                </div>
              ))}
            </div>

            {/* Wishlist Actions */}
            <div className="mt-8 sm:mt-12 card p-4 sm:p-6 animate-slide-up animate-delay-500">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
                What's Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Link
                  to="/listings"
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/40 dark:hover:to-secondary-900/40 transition-all duration-300 group"
                >
                  <MagnifyingGlassIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Find More PGs</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Explore more options</p>
                  </div>
                </Link>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 transition-all duration-300 group"
                >
                  <ShareIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Share Wishlist</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Share with friends</p>
                  </div>
                </button>

                <button
                  onClick={handleClearWishlist}
                  className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 transition-all duration-300 group sm:col-span-2 lg:col-span-1"
                >
                  <TrashIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Clear Wishlist</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Start fresh</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
