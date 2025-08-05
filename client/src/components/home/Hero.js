// src/components/home/Hero.js - Enhanced Hero Section
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  UserGroupIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import SearchAutocomplete from '../common/SearchAutocomplete';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    city: '',
    gender: '',
    maxPrice: '',
    minPrice: ''
  });
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalUsers: 0,
    citiesCovered: 0,
    averageRating: 0
  });
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate stats counter
    const animateStats = () => {
      const targets = {
        totalPGs: 1250,
        totalUsers: 15600,
        citiesCovered: 28,
        averageRating: 4.8
      };

      Object.keys(targets).forEach(key => {
        let current = 0;
        const target = targets[key];
        const increment = target / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current * 10) / 10 }));
        }, 30);
      });
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchParams) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/listings?${queryParams.toString()}`);
  };

  const handleQuickSearch = (city) => {
    navigate(`/listings?city=${city}`);
  };

  const popularCities = [
    { name: 'Mumbai', count: 245, gradient: 'from-blue-500 to-purple-600' },
    { name: 'Bangalore', count: 189, gradient: 'from-green-500 to-teal-600' },
    { name: 'Pune', count: 156, gradient: 'from-orange-500 to-red-600' },
    { name: 'Delhi', count: 134, gradient: 'from-pink-500 to-rose-600' },
    { name: 'Hyderabad', count: 98, gradient: 'from-indigo-500 to-blue-600' },
    { name: 'Chennai', count: 87, gradient: 'from-yellow-500 to-orange-600' }
  ];

  const features = [
    'Verified PG Owners',
    '24/7 Customer Support',
    'No Brokerage Fee',
    'Virtual Tours Available'
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900"></div>
        <div 
          className="absolute inset-0 opacity-20 bg-hero-pattern"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-accent-400 to-warning-400 rounded-full opacity-20 animate-float animate-delay-200"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-20 animate-float animate-delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-responsive py-20 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 animate-fade-in">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Trusted by 15,000+ Students & Professionals</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 animate-slide-up">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Perfect PG
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-200 mt-2">
              In Minutes, Not Days
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
            Discover comfortable, affordable, and verified PG accommodations across India. 
            Join thousands of happy residents who found their home away from home.
          </p>

          {/* Enhanced Search Form */}
          <div className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl mb-12 animate-zoom-in animate-delay-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Location Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <SearchAutocomplete 
                  onSearch={handleSearch}
                  placeholder="Enter city, area, or PG name..."
                />
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <UserGroupIcon className="w-4 h-4 inline mr-1" />
                  Gender Preference
                </label>
                <select
                  className="input"
                  value={searchData.gender}
                  onChange={(e) => setSearchData({...searchData, gender: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="both">Co-ed</option>
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <CurrencyRupeeIcon className="w-4 h-4 inline mr-1" />
                  Max Budget
                </label>
                <select
                  className="input"
                  value={searchData.maxPrice}
                  onChange={(e) => setSearchData({...searchData, maxPrice: e.target.value})}
                >
                  <option value="">Any Budget</option>
                  <option value="10000">Under ₹10,000</option>
                  <option value="15000">Under ₹15,000</option>
                  <option value="20000">Under ₹20,000</option>
                  <option value="25000">Under ₹25,000</option>
                  <option value="30000">₹30,000+</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch(searchData)}
              className="w-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              <MagnifyingGlassIcon className="w-6 h-6 group-hover:animate-pulse" />
              <span className="text-lg">Search Perfect PGs</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <CheckCircleIcon className="w-4 h-4 text-success-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Cities */}
          <div className="mb-12 animate-slide-up animate-delay-500">
            <h3 className="text-xl font-semibold text-white mb-6">Popular Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(city.name)}
                  className={`bg-gradient-to-r ${city.gradient} p-4 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group`}
                >
                  <div className="text-lg font-bold">{city.name}</div>
                  <div className="text-sm opacity-90">{city.count} PGs</div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center animate-bounce-in animate-delay-300">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.totalPGs.toLocaleString()}+
              </div>
              <div className="text-gray-300">Verified PGs</div>
            </div>
            <div className="text-center animate-bounce-in animate-delay-500">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-gray-300">Happy Residents</div>
            </div>
            <div className="text-center animate-bounce-in animate-delay-700">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {stats.citiesCovered}+
              </div>
              <div className="text-gray-300">Cities Covered</div>
            </div>
            <div className="text-center animate-bounce-in animate-delay-1000">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center">
                {stats.averageRating}
                <StarIcon className="w-8 h-8 text-yellow-400 ml-1" />
              </div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up animate-delay-700">
            <button
              onClick={() => navigate('/listings')}
              className="btn btn-primary btn-xl shadow-2xl hover:shadow-glow transform hover:scale-105"
            >
              Explore All PGs
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={() => setShowVideo(true)}
              className="btn btn-ghost btn-xl bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-xl"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="FindMyPG Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;