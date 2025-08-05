import React, { useState, useRef, useEffect } from 'react';
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const GoogleMaps = ({ 
  location, 
  pgName, 
  className = "w-full h-64 md:h-80",
  showDirections = true,
  zoom = 15 
}) => {
  const [mapError, setMapError] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const mapRef = useRef(null);

  // For demo purposes, using coordinates based on major cities
  const getCityCoordinates = (city) => {
    const coordinates = {
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'delhi': { lat: 28.7041, lng: 77.1025 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'surat': { lat: 21.1702, lng: 72.8311 }
    };
    
    const cityKey = city?.toLowerCase();
    return coordinates[cityKey] || coordinates['mumbai']; // Default to Mumbai
  };

  const coordinates = location?.coordinates || getCityCoordinates(location?.city);
  const address = `${location?.address || ''}, ${location?.city || ''}, ${location?.state || ''}`.trim();

  const handleShowMap = () => {
    setShowIframe(true);
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(address);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    window.open(directionsUrl, '_blank');
  };

  const handleMapError = () => {
    setMapError(true);
  };

  if (mapError) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-dark-700 rounded-2xl flex flex-col items-center justify-center p-6`}>
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Unable to load map for this location
        </p>
        <button
          onClick={handleGetDirections}
          className="btn btn-outline btn-sm"
        >
          <MapPinIcon className="w-4 h-4 mr-2" />
          Get Directions
        </button>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-700`}>
      {!showIframe ? (
        // Preview/Placeholder
        <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <MapPinIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {pgName} Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {address}
            </p>
            {coordinates && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleShowMap}
              className="btn btn-primary btn-sm"
            >
              <MapPinIcon className="w-4 h-4 mr-2" />
              View Map
            </button>
            
            {showDirections && (
              <button
                onClick={handleGetDirections}
                className="btn btn-outline btn-sm"
              >
                Get Directions
              </button>
            )}
          </div>
        </div>
      ) : (
        // Interactive Map
        <div className="w-full h-full relative">
          <iframe
            ref={mapRef}
            src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOMD0C2EnNahnA&q=${encodeURIComponent(address)}&zoom=${zoom}`}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${pgName}`}
            onError={handleMapError}
          />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            {showDirections && (
              <button
                onClick={handleGetDirections}
                className="bg-white dark:bg-dark-800 shadow-lg rounded-lg p-2 hover:shadow-xl transition-shadow"
                title="Get Directions"
              >
                <MapPinIcon className="w-5 h-5 text-primary-600" />
              </button>
            )}
          </div>

          {/* Location Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white dark:bg-dark-800 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 rounded-xl p-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {pgName}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {address}
                  </p>
                </div>
                <MapPinIcon className="w-5 h-5 text-primary-600 mt-0.5 ml-2 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMaps;