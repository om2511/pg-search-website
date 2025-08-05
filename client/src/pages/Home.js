import React from 'react';
import { MagnifyingGlassIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Hero from '../components/home/Hero';
import FeaturedPGs from '../components/home/FeaturedPGs';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedPGs />
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FindMyPG?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find PGs based on your preferences and budget</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Owners</h3>
              <p className="text-gray-600">All PG owners are verified for your safety</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">PGs in the best locations with good connectivity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;