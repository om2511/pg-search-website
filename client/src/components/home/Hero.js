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
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-accent-400 to-warning-400 rounded-full opacity-20 animate-float animate-delay-200"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-10 sm:left-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full opacity-20 animate-float animate-delay-500"></div>
        <div className="absolute top-1/2 right-5 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-warning-400 to-accent-400 rounded-full opacity-15 animate-float animate-delay-700 hidden sm:block"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-responsive py-12 sm:py-16 lg:py-15">
        {/* Hero Section - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[80vh] lg:min-h-[70vh]">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in">
              <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-medium text-sm sm:text-base">Trusted by 15,000+ Students & Professionals</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold text-white mb-4 sm:mb-6 animate-slide-up leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Perfect PG
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-gray-200 mt-2">
                In Minutes, Not Days
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto xl:mx-0 leading-relaxed animate-slide-up animate-delay-200">
              Discover comfortable, affordable, and verified PG accommodations across India. 
              Join thousands of happy residents who found their home away from home.
            </p>

            {/* Features List - Mobile Hidden, Desktop Visible */}
            <div className="hidden lg:flex flex-wrap gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-300 animate-fade-in bg-white/5 backdrop-blur-sm rounded-full px-4 py-2"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <CheckCircleIcon className="w-4 h-4 text-success-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-4 animate-slide-up animate-delay-700">
              <button
                onClick={() => navigate('/listings')}
                className="btn btn-primary btn-lg shadow-2xl hover:shadow-glow transform hover:scale-[1.02]"
              >
                Explore All PGs
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/about')}
                className="btn btn-ghost btn-lg bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-xl"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Learn More
              </button>
            </div>
          </div>

          {/* Mobile/Tablet CTA Buttons */}
          <div className="lg:hidden flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up animate-delay-700 order-2">
            <button
              onClick={() => navigate('/listings')}
              className="btn btn-primary btn-lg sm:btn-xl shadow-2xl hover:shadow-glow transform hover:scale-[1.02] w-full sm:w-auto"
            >
              Explore All PGs
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={() => navigate('/about')}
              className="btn btn-ghost btn-lg sm:btn-xl bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 shadow-xl w-full sm:w-auto transform hover:scale-[1.02] transition-all duration-300"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Learn More
            </button>
          </div>

          {/* Right Column - Search Form */}
          <div className="order-3 lg:order-2 mt-8 sm:mt-12 lg:mt-0">
            <div className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl animate-zoom-in animate-delay-300 max-w-lg mx-auto lg:mx-0 lg:max-w-none">
              <div className="space-y-4 sm:space-y-6">
                {/* Location Search */}
                <div>
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
                    className="w-full px-3 py-3 border border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full px-3 py-3 border border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-sm"
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

                {/* Search Button */}
                <button
                  onClick={() => handleSearch(searchData)}
                  className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="text-sm">Search Perfect PGs</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Features List - Mobile/Tablet Only */}
                <div className="lg:hidden flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 animate-fade-in bg-gray-50 dark:bg-dark-700 rounded-full px-2 sm:px-3 py-1"
                      style={{ animationDelay: `${500 + index * 100}ms` }}
                    >
                      <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-success-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cities */}
        <div className="mt-12 sm:mt-16 lg:mt-20 animate-slide-up animate-delay-500">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-6 sm:mb-8 text-center">Popular Cities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {popularCities.map((city, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(city.name)}
                className={`bg-gradient-to-r ${city.gradient} p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className="text-sm sm:text-lg font-bold">{city.name}</div>
                <div className="text-xs sm:text-sm opacity-90">{city.count} PGs</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center animate-bounce-in animate-delay-300 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {stats.totalPGs.toLocaleString()}+
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Verified PGs</div>
          </div>
          <div className="text-center animate-bounce-in animate-delay-500 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {stats.totalUsers.toLocaleString()}+
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Happy Residents</div>
          </div>
          <div className="text-center animate-bounce-in animate-delay-700 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {stats.citiesCovered}+
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Cities Covered</div>
          </div>
          <div className="text-center animate-bounce-in animate-delay-1000 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center">
              {stats.averageRating}
              <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 ml-1" />
            </div>
            <div className="text-gray-300 text-sm sm:text-base">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;