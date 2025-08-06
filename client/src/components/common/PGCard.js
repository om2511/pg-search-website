import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { 
  MapPinIcon, 
  CurrencyRupeeIcon,
  UserGroupIcon,
  WifiIcon,
  TvIcon,
  HomeIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  EyeIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PGCard = ({ pg, viewMode = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(pg._id);

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: WifiIcon,
      tv: TvIcon,
      ac: HomeIcon,
      security: ShieldCheckIcon,
      parking: HomeIcon,
      meals: HomeIcon,
      gym: HomeIcon,
      cleaning: HomeIcon,
      washing_machine: HomeIcon,
      fridge: HomeIcon
    };
    const IconComponent = icons[amenity] || HomeIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatAmenityName = (amenity) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Wishlist toggle clicked for PG:', pg._id);
    console.log('Current wishlist status:', isWishlisted);
    
    if (isWishlisted) {
      console.log('Removing from wishlist');
      removeFromWishlist(pg._id);
    } else {
      console.log('Adding to wishlist');
      addToWishlist(pg._id);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: pg.name,
        text: `Check out this amazing PG: ${pg.name}`,
        url: window.location.origin + `/pg/${pg._id}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/pg/${pg._id}`);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/pg/${pg._id}`} 
        className="block bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] group overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-300 dark:bg-dark-600 animate-pulse"></div>
            )}
            <img
              src={imageError ? '/api/placeholder/400/250' : (pg.images?.[0] || '/api/placeholder/400/250')}
              alt={pg.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setIsImageLoaded(true);
              }}
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
              >
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                pg.gender === 'both' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : pg.gender === 'boys'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
              }`}>
                {pg.gender === 'both' ? 'Co-ed' : pg.gender.charAt(0).toUpperCase() + pg.gender.slice(1)}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {pg.name}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{pg.location?.city}, {pg.location?.state}</span>
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.2 (128 reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold text-2xl mb-1">
                  <CurrencyRupeeIcon className="w-6 h-6" />
                  <span>{pg.price?.toLocaleString()}</span>
                </div>
                <span className="text-gray-500 text-sm">per month</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {pg.amenities?.slice(0, 6).map((amenity, index) => (
                <div key={index} className="flex items-center space-x-1 bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-full text-xs">
                  {getAmenityIcon(amenity)}
                  <span className="text-gray-700 dark:text-gray-300">{formatAmenityName(amenity)}</span>
                </div>
              ))}
              {pg.amenities?.length > 6 && (
                <div className="bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full text-xs font-medium text-primary-700 dark:text-primary-300">
                  +{pg.amenities.length - 6} more
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <UserGroupIcon className="w-4 h-4 mr-1" />
                <span>{pg.availableRooms || 0} rooms available</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  <span>156 views</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (Default)
  return (
    <Link 
      to={`/pg/${pg._id}`} 
      className="block bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-1 group overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-dark-600 animate-pulse"></div>
        )}
        <img
          src={imageError ? '/api/placeholder/400/250' : (pg.images?.[0] || '/api/placeholder/400/250')}
          alt={pg.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setIsImageLoaded(true);
          }}
        />
        
        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          >
            <ShareIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            pg.gender === 'both' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : pg.gender === 'boys'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
          }`}>
            {pg.gender === 'both' ? 'Co-ed' : pg.gender.charAt(0).toUpperCase() + pg.gender.slice(1)}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
          <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold">
            <CurrencyRupeeIcon className="w-4 h-4" />
            <span>{pg.price?.toLocaleString()}/mo</span>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {pg.name}
        </h3>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{pg.location?.city}, {pg.location?.state}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.2 (128)</span>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pg.amenities?.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center text-gray-500 dark:text-gray-400">
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {pg.amenities?.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{pg.amenities.length - 4} more</span>
          )}
        </div>
        
        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <UserGroupIcon className="w-4 h-4 mr-1" />
            <span>{pg.availableRooms || 0} available</span>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Updated 2 days ago
          </div>
        </div>
      </div>
    </Link>
  );
};

// Skeleton component for loading state
const PGCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-dark-600"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-dark-600 rounded w-1/2 mb-4"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded-full w-16"></div>
        <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded-full w-16"></div>
      </div>
      <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
    </div>
  </div>
);

// Mock data for fallback
const mockPGs = [
  {
    _id: '1',
    name: 'Sunshine Residency',
    location: { city: 'Mumbai', state: 'Maharashtra' },
    price: 15000,
    gender: 'both',
    amenities: ['wifi', 'ac', 'meals', 'security', 'parking'],
    availableRooms: 3,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
  },
  {
    _id: '2',
    name: 'Green Valley PG',
    location: { city: 'Bangalore', state: 'Karnataka' },
    price: 12000,
    gender: 'girls',
    amenities: ['wifi', 'tv', 'fridge', 'washing_machine', 'cleaning'],
    availableRooms: 2,
    images: ['https://images.unsplash.com/photo-1540518614846-7eded47c0419?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
  },
  // Add more mock data as needed...
];

export default PGCard;