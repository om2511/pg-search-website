import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  PhotoIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const EditPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    price: '',
    totalRooms: '',
    availableRooms: '',
    gender: 'boys',
    amenities: [],
    rules: [],
    images: [],
    contact: {
      phone: '',
      email: ''
    },
    availability: true
  });
  
  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const amenityOptions = [
    'wifi', 'ac', 'tv', 'parking', 'meals', 'security', 
    'gym', 'cleaning', 'washing_machine', 'fridge', 'water_cooler',
    'power_backup', 'cctv', 'study_room', 'recreation_room'
  ];

  const fetchPGDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/pgs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const pgData = response.data.data;
      setFormData({
        name: pgData.name || '',
        description: pgData.description || '',
        location: {
          address: pgData.location?.address || '',
          city: pgData.location?.city || '',
          state: pgData.location?.state || '',
          pincode: pgData.location?.pincode || ''
        },
        price: pgData.price || '',
        totalRooms: pgData.totalRooms || '',
        availableRooms: pgData.availableRooms || '',
        gender: pgData.gender || 'boys',
        amenities: pgData.amenities || [],
        rules: pgData.rules || [],
        images: pgData.images || [],
        contact: {
          phone: pgData.contact?.phone || '',
          email: pgData.contact?.email || ''
        },
        availability: pgData.availability !== undefined ? pgData.availability : true
      });
      
      setPreviewImages(pgData.images || []);
    } catch (error) {
      console.error('Error fetching PG details:', error);
      showError('Error', 'Failed to load PG details');
      navigate('/owner/manage-pgs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showError]);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchPGDetails();
    }
  }, [user, fetchPGDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const addRule = () => {
    if (newRule.trim() && !formData.rules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (ruleToRemove) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule !== ruleToRemove)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 10) {
      showError('Too many images', 'Maximum 10 images allowed');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const isExistingImage = index < formData.images.length;
    
    if (isExistingImage) {
      // Remove from existing images
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new image files
      const newFileIndex = index - formData.images.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append text data
      Object.keys(formData).forEach(key => {
        if (key === 'location' || key === 'contact') {
          Object.keys(formData[key]).forEach(subKey => {
            submitData.append(`${key}.${subKey}`, formData[key][subKey]);
          });
        } else if (key === 'amenities' || key === 'rules') {
          formData[key].forEach(item => {
            submitData.append(key, item);
          });
        } else if (key === 'images') {
          // Keep existing images
          formData[key].forEach(image => {
            submitData.append('existingImages', image);
          });
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append new image files
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      await axios.put(`/api/pgs/${id}`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('Success', 'PG updated successfully');
      navigate('/owner/manage-pgs');
    } catch (error) {
      console.error('Error updating PG:', error);
      showError('Error', error.response?.data?.message || 'Failed to update PG');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">This page is only available to PG owners.</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="container-responsive px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit PG Listing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your PG information and details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <HomeIcon className="w-5 h-5 mr-2 text-primary-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PG Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender Preference *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                  <option value="both">Co-ed</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="input w-full resize-none"
                placeholder="Describe your PG, facilities, and what makes it special..."
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
              Location Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="House/Building name, Street, Area"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleInputChange}
                    className="input w-full"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Rooms */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-primary-600" />
              Pricing & Room Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input w-full"
                  min="1000"
                  max="100000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Rooms *
                </label>
                <input
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  className="input w-full"
                  min="1"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Rooms *
                </label>
                <input
                  type="number"
                  name="availableRooms"
                  value={formData.availableRooms}
                  onChange={handleInputChange}
                  className="input w-full"
                  min="0"
                  max={formData.totalRooms}
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2 text-primary-600" />
              Images
            </h2>
            
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn btn-outline cursor-pointer inline-flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Images
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Maximum 10 images. Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-primary-600" />
              Amenities
            </h2>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {amenityOptions.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => addAmenity(amenity)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.amenities.includes(amenity)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Custom amenity"
                  className="input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(newAmenity))}
                />
                <button
                  type="button"
                  onClick={() => addAmenity(newAmenity)}
                  className="btn btn-outline"
                >
                  Add
                </button>
              </div>
            </div>

            {formData.amenities.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Selected Amenities:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm"
                    >
                      {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rules */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Rules & Regulations
            </h2>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add a rule or regulation"
                className="input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
              />
              <button
                type="button"
                onClick={addRule}
                className="btn btn-outline"
              >
                Add Rule
              </button>
            </div>

            {formData.rules.length > 0 && (
              <ul className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                    <button
                      type="button"
                      onClick={() => removeRule(rule)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="input w-full"
                  pattern="[0-9+\-\s\(\)]+"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card p-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="availability"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="availability" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                This PG is currently available for bookings
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-1 lg:flex-none"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update PG'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/owner/manage-pgs')}
              className="btn btn-outline flex-1 lg:flex-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPG;
