import React, { useState, useEffect } from 'react';

const PriceRangeSlider = ({ min = 5000, max = 50000, value, onChange }) => {
  const [minValue, setMinValue] = useState(value?.min || min);
  const [maxValue, setMaxValue] = useState(value?.max || max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange({ min: minValue, max: maxValue });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [minValue, maxValue, onChange]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxValue - 1000);
    setMinValue(val);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minValue + 1000);
    setMaxValue(val);
  };

  const getPercent = (value) => ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Range Display */}
      <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg">
          ₹{minValue.toLocaleString()}
        </span>
        <span className="text-gray-400">to</span>
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg">
          ₹{maxValue.toLocaleString()}
        </span>
      </div>
      
      {/* Slider Container */}
      <div className="relative">
        <div className="relative h-2 bg-gray-200 dark:bg-dark-600 rounded-lg">
          {/* Active Range */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg"
            style={{
              left: `${getPercent(minValue)}%`,
              width: `${getPercent(maxValue) - getPercent(minValue)}%`
            }}
          ></div>
        </div>
        
        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ top: 0 }}
        />
        
        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ top: 0 }}
        />
      </div>
      
      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>₹{min.toLocaleString()}</span>
        <span>₹{max.toLocaleString()}</span>
      </div>

      {/* Quick Price Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Under ₹10k', min: 5000, max: 10000 },
          { label: '₹10k-₹15k', min: 10000, max: 15000 },
          { label: '₹15k-₹25k', min: 15000, max: 25000 },
          { label: 'Above ₹25k', min: 25000, max: 50000 }
        ].map((preset, index) => (
          <button
            key={index}
            onClick={() => {
              setMinValue(preset.min);
              setMaxValue(preset.max);
            }}
            className="p-2 text-xs bg-gray-100 dark:bg-dark-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 rounded-lg transition-all duration-300"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeSlider;