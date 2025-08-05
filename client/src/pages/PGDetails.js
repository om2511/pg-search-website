// src/pages/PGDetails.js - Enhanced PG Details Page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import PGCard from '../components/common/PGCard';
import GoogleMaps from '../components/common/GoogleMaps';
import axios from 'axios';
import {
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  WifiIcon,
  TvIcon,
  HomeIcon,
  ShieldCheckIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [similarPGs, setSimilarPGs] = useState([]);

  useEffect(() => {
    fetchPGDetails();
    fetchReviews();
    fetchSimilarPGs();
  }, [id]);

  const fetchPGDetails = async () => {
    try {
      const response = await axios.get(`/api/pgs/${id}`);
      setPg(response.data.data);
    } catch (error) {
      showError('Error', 'Failed to load PG details');
      console.error('Error fetching PG details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/pgs/${id}/reviews`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchSimilarPGs = async () => {
    try {
      const response = await axios.get(`/api/pgs/similar/${id}`);
      setSimilarPGs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching similar PGs:', error);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(pg._id)) {
      removeFromWishlist(pg._id);
      showInfo('Removed from wishlist', 'PG removed from your wishlist');
    } else {
      addToWishlist(pg._id);
      showSuccess('Added to wishlist', 'PG saved to your wishlist');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: pg.name,
      text: `Check out this amazing PG: ${pg.name} in ${pg.location?.city}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showSuccess('Shared successfully', 'PG details shared');
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showInfo('Link copied', 'PG link copied to clipboard');
  };

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
    return <IconComponent className="w-5 h-5" />;
  };

  const formatAmenityName = (amenity) => {
    return amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (pg.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (pg.images?.length - 1) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading PG details...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">PG not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The PG you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/listings')}
            className="btn btn-primary"
          >
            Browse Other PGs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Hero Image Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={pg.images?.[currentImageIndex] || '/api/placeholder/1200/500'}
          alt={pg.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20">
          {/* Top Controls */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <ShareIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className="p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                {isInWishlist(pg._id) ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <button className="p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                <FlagIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Image Navigation */}
          {pg.images && pg.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 dark:bg-dark-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
                <span className="text-sm font-medium">
                  {currentImageIndex + 1} / {pg.images.length}
                </span>
              </div>
            </>
          )}

          {/* View All Photos Button */}
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute bottom-6 right-6 flex items-center space-x-2 bg-white/90 dark:bg-dark-800/90 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PhotoIcon className="w-5 h-5" />
            <span className="font-medium">View All Photos</span>
          </button>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="card p-8 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      {pg.name}
                    </h1>
                    <div className="badge badge-primary">
                      {pg.gender === 'both' ? 'Co-ed' : pg.gender.charAt(0).toUpperCase() + pg.gender.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-lg">{pg.location?.address}, {pg.location?.city}, {pg.location?.state} - {pg.location?.pincode}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">4.2 (128 reviews)</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      <span>1,245 views</span>
                    </div>
                  </div>
                </div>

                <div className="lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end text-primary-600 dark:text-primary-400 font-bold text-3xl lg:text-4xl mb-2">
                    <CurrencyRupeeIcon className="w-8 h-8" />
                    <span>{pg.price?.toLocaleString()}</span>
                  </div>
                  <span className="text-gray-500 text-lg">per month</span>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    + ₹2,000 security deposit
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-dark-700 rounded-2xl">
                <div className="text-center">
                  <HomeIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{pg.totalRooms}</div>
                </div>
                <div className="text-center">
                  <UserGroupIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{pg.availableRooms} rooms</div>
                </div>
                <div className="text-center">
                  <CalendarIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Min Stay</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">3 months</div>
                </div>
                <div className="text-center">
                  <ClockIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available From</div>
                  <div className="font-bold text-lg text-gray-900 dark:text-white">Immediate</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-8 animate-slide-up animate-delay-200">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <HomeIcon className="w-6 h-6 mr-2 text-primary-600" />
                About This PG
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {pg.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="card p-8 animate-slide-up animate-delay-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-success-600" />
                Amenities & Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pg.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-xl flex items-center justify-center">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {formatAmenityName(amenity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules & Regulations */}
            {pg.rules && pg.rules.length > 0 && (
              <div className="card p-8 animate-slide-up animate-delay-400">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-warning-600" />
                  Rules & Regulations
                </h2>
                <ul className="space-y-3">
                  {pg.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Location & Map */}
            <div className="card p-8 animate-slide-up animate-delay-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2 text-accent-600" />
                Location & Nearby
              </h2>
              
              {/* Google Map */}
              <GoogleMaps 
                location={pg.location}
                pgName={pg.name}
                className="w-full h-80 mb-6"
                showDirections={true}
                zoom={16}
              />

              {/* Nearby Places */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🏢 Nearby Offices</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Tech Park - 2.5 km</li>
                    <li>• Business District - 3.1 km</li>
                    <li>• IT Hub - 4.2 km</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🚇 Public Transport</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Metro Station - 0.8 km</li>
                    <li>• Bus Stop - 0.2 km</li>
                    <li>• Railway Station - 5.5 km</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🛒 Shopping & Dining</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Shopping Mall - 1.2 km</li>
                    <li>• Restaurants - 0.5 km</li>
                    <li>• Grocery Store - 0.3 km</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🏥 Essential Services</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Hospital - 2.1 km</li>
                    <li>• ATM - 0.1 km</li>
                    <li>• Pharmacy - 0.4 km</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card p-8 animate-slide-up animate-delay-600">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
                Reviews & Ratings
              </h2>

              {/* Overall Rating */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 dark:bg-dark-700 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">4.2</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Based on 128 reviews</div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{rating}★</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-600 rounded-full">
                        <div 
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${rating === 4 ? 45 : rating === 5 ? 35 : rating === 3 ? 15 : 5}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                        {rating === 4 ? 58 : rating === 5 ? 45 : rating === 3 ? 19 : rating === 2 ? 4 : 2}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cleanliness</span>
                    <span className="font-semibold">4.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Safety</span>
                    <span className="font-semibold">4.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Value for Money</span>
                    <span className="font-semibold">4.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-semibold">4.4</span>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-dark-600 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.user?.avatar || `/api/placeholder/40/40`}
                        alt={review.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {review.user?.name || 'Anonymous User'}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < (review.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment || "Great place to stay! Clean rooms, friendly staff, and excellent facilities."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 btn btn-outline">
                View All Reviews
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="card p-6 animate-slide-left animate-delay-200">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Contact Owner
                </h3>
                
                <div className="text-center mb-6">
                  <img
                    src={pg.owner?.avatar || '/api/placeholder/80/80'}
                    alt={pg.owner?.name}
                    className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-lg"
                  />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {pg.owner?.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">Property Owner</p>
                  <div className="flex items-center justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">(4.8)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`tel:${pg.contact?.phone}`}
                    className="btn btn-primary w-full flex items-center justify-center"
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Call Now
                  </a>

                  <button
                    onClick={() => setShowContactModal(true)}
                    className="btn btn-outline w-full flex items-center justify-center"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Send Message
                  </button>

                  <a
                    href={`mailto:${pg.contact?.email}`}
                    className="btn btn-ghost w-full flex items-center justify-center"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Send Email
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{pg.contact?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 break-all">{pg.contact?.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Availability Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Available Rooms</span>
                    <span className="font-semibold text-success-600">{pg.availableRooms} / {pg.totalRooms}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(pg.availableRooms / pg.totalRooms) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <CheckCircleIcon className="w-5 h-5 text-success-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Immediate Move-in Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Features */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-success-600" />
                  Safety Features
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-success-500" />
                    <span className="text-gray-700 dark:text-gray-300">24/7 Security Guard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-success-500" />
                    <span className="text-gray-700 dark:text-gray-300">CCTV Surveillance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-success-500" />
                    <span className="text-gray-700 dark:text-gray-300">Biometric Access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-success-500" />
                    <span className="text-gray-700 dark:text-gray-300">Fire Safety Equipment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Similar PGs */}
        {similarPGs.length > 0 && (
          <div className="mt-16 animate-slide-up animate-delay-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Similar Properties You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarPGs.slice(0, 3).map((similarPG, index) => (
                <PGCard key={similarPG._id} pg={similarPG} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pg.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${pg.name} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowImageModal(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Send Message to {pg.owner?.name}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  className="input"
                  placeholder="Hi, I'm interested in your PG. Could you please share more details?"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGDetails;