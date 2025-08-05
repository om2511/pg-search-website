// src/components/common/ImageUpload.js
import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ images, onChange, maxImages = 5 }) => {
  const [previews, setPreviews] = useState(images || []);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (previews.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPreviews = [...previews, e.target.result];
          setPreviews(newPreviews);
          onChange(newPreviews);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images (Max {maxImages})
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {previews.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors"
          >
            <PhotoIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;