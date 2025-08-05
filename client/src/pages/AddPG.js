import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  HomeIcon,
  ClockIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AddPG = () => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
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
    securityDeposit: '',
    gender: 'boys',
    amenities: [],
    contact: {
      phone: '',
      email: ''
    },
    totalRooms: '',
    roomTypes: [],
    rules: [''],
    images: [],
    availableFrom: '',
    minStay: '3'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, name: 'Basic Info', icon: InformationCircleIcon },
    { id: 2, name: 'Location', icon: MapPinIcon },
    { id: 3, name: 'Photos', icon: PhotoIcon },
    { id: 4, name: 'Amenities', icon: CheckCircleIcon },
    { id: 5, name: 'Rules & Final', icon: HomeIcon }
  ];

  const amenityOptions = [
    { value: 'wifi', label: 'Wi-Fi', icon: '📶', category: 'essential' },
    { value: 'ac', label: 'Air Conditioning', icon: '❄️', category: 'comfort' },
    { value: 'tv', label: 'Television', icon: '📺', category: 'entertainment' },
    { value: 'fridge', label: 'Refrigerator', icon: '🧊', category: 'essential' },
    { value: 'washing_machine', label: 'Washing Machine', icon: '👕', category: 'essential' },
    { value: 'parking', label: 'Parking', icon: '🚗', category: 'convenience' },
    { value: 'security', label: '24/7 Security', icon: '🔒', category: 'safety' },
    { value: 'meals', label: 'Meals Included', icon: '🍽️', category: 'convenience' },
    { value: 'cleaning', label: 'Housekeeping', icon: '🧹', category: 'convenience' },
    { value: 'gym', label: 'Gymnasium', icon: '💪', category: 'recreation' },
    { value: 'study_room', label: 'Study Room', icon: '📚', category: 'study' },
    { value: 'common_area', label: 'Common Area', icon: '🛋️', category: 'social' }
  ];

  const roomTypeOptions = [
    { value: 'single', label: 'Single Occupancy', price: '+₹3000' },
    { value: 'double', label: 'Double Sharing', price: 'Base Price' },
    { value: 'triple', label: 'Triple Sharing', price: '-₹2000' },
    { value: 'dormitory', label: 'Dormitory (4+)', price: '-₹4000' }
  ];

  if (!isAuthenticated || user?.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in as a PG owner to add a listing.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Login as Owner
            </button>
            <button 
              onClick={() => navigate('/listings')}
              className="btn btn-outline"
            >
              Browse PGs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityChange = (amenityValue) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityValue)
        ? prev.amenities.filter(a => a !== amenityValue)
        : [...prev.amenities, amenityValue]
    }));
  };

  const handleRoomTypeChange = (roomType) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomType)
        ? prev.roomTypes.filter(rt => rt !== roomType)
        : [...prev.roomTypes, roomType]
    }));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const removeRule = (index) => {
    if (formData.rules.length > 1) {
      setFormData(prev => ({
        ...prev,
        rules: prev.rules.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 10) {
      showWarning('Too many images', 'You can upload maximum 10 images');
      return;
    }

    setImageUploading(true);
    
    try {
      const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          // Validate file
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not an image`));
            return;
          }
          
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            reject(new Error(`${file.name} is too large (max 5MB)`));
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const imageDataUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageDataUrls]
      }));
      
      showSuccess('Images uploaded', `${files.length} image(s) added successfully`);
    } catch (error) {
      showError('Upload failed', error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'PG name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price || formData.price < 1000) newErrors.price = 'Valid price is required';
        if (!formData.totalRooms || formData.totalRooms < 1) newErrors.totalRooms = 'At least 1 room is required';
        break;
      case 2:
        if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
        if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
        if (!formData.location.state.trim()) newErrors['location.state'] = 'State is required';
        if (!formData.location.pincode.trim()) newErrors['location.pincode'] = 'Pincode is required';
        if (!formData.contact.phone.trim()) newErrors['contact.phone'] = 'Phone is required';
        if (!formData.contact.email.trim()) newErrors['contact.email'] = 'Email is required';
        break;
      case 3:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 4:
        if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseInt(formData.price),
        securityDeposit: parseInt(formData.securityDeposit) || 0,
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.totalRooms),
        rules: formData.rules.filter(rule => rule.trim() !== ''),
        minStay: parseInt(formData.minStay) || 3
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/pgs', submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showSuccess('PG Listed Successfully!', 'Your PG is now live and available for bookings');
      navigate(`/pg/${response.data.data._id}`);
    } catch (error) {
      showError('Listing Failed', error.response?.data?.message || 'Error creating PG listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <InformationCircleIcon className="w-6 h-6 mr-2 text-primary-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  PG Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g., Sunshine Residency"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent (₹) *
                </label>
                <div className="relative">
                  <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="1000"
                    className={`input pl-12 ${errors.price ? 'input-error' : ''}`}
                    placeholder="15000"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-error-600">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Security Deposit (₹)
                </label>
                <div className="relative">
                  <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="securityDeposit"
                    min="0"
                    className="input pl-12"
                    placeholder="5000"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gender Preference *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'boys', label: 'Boys Only', emoji: '👨' },
                    { value: 'girls', label: 'Girls Only', emoji: '👩' },
                    { value: 'both', label: 'Co-ed', emoji: '👥' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'gender', value: option.value } })}
                      className={`p-3 rounded-xl text-center transition-all duration-300 ${
                        formData.gender === option.value
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Rooms *
                </label>
                <div className="relative">
                  <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="totalRooms"
                    required
                    min="1"
                    className={`input pl-12 ${errors.totalRooms ? 'input-error' : ''}`}
                    placeholder="10"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.totalRooms && <p className="mt-1 text-sm text-error-600">{errors.totalRooms}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe your PG, its facilities, nearby attractions, and what makes it special..."
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description}</p>}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2 text-primary-600" />
              Location & Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  required
                  className={`input ${errors['location.address'] ? 'input-error' : ''}`}
                  placeholder="Building name, street, area"
                  value={formData.location.address}
                  onChange={handleInputChange}
                />
                {errors['location.address'] && <p className="mt-1 text-sm text-error-600">{errors['location.address']}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="location.city"
                  required
                  className={`input ${errors['location.city'] ? 'input-error' : ''}`}
                  placeholder="Mumbai"
                  value={formData.location.city}
                  onChange={handleInputChange}
                />
                {errors['location.city'] && <p className="mt-1 text-sm text-error-600">{errors['location.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="location.state"
                  required
                  className={`input ${errors['location.state'] ? 'input-error' : ''}`}
                  placeholder="Maharashtra"
                  value={formData.location.state}
                  onChange={handleInputChange}
                />
                {errors['location.state'] && <p className="mt-1 text-sm text-error-600">{errors['location.state']}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="location.pincode"
                  required
                  pattern="[0-9]{6}"
                  className={`input ${errors['location.pincode'] ? 'input-error' : ''}`}
                  placeholder="400001"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                />
                {errors['location.pincode'] && <p className="mt-1 text-sm text-error-600">{errors['location.pincode']}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contact.phone"
                  required
                  className={`input ${errors['contact.phone'] ? 'input-error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                />
                {errors['contact.phone'] && <p className="mt-1 text-sm text-error-600">{errors['contact.phone']}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contact.email"
                  required
                  className={`input ${errors['contact.email'] ? 'input-error' : ''}`}
                  placeholder="owner@example.com"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                />
                {errors['contact.email'] && <p className="mt-1 text-sm text-error-600">{errors['contact.email']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  className="input"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Stay (months)
                </label>
                <select
                  name="minStay"
                  className="input"
                  value={formData.minStay}
                  onChange={handleInputChange}
                >
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2 text-primary-600" />
              Upload Photos
            </h2>

            <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-2xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload PG Photos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add up to 10 high-quality photos. First photo will be the main display image.
              </p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="btn btn-primary btn-lg"
              >
                {imageUploading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <PhotoIcon className="w-5 h-5 mr-2" />
                    Choose Photos
                  </>
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <p className="text-xs text-gray-500 mt-3">
                Supported formats: JPG, PNG, WebP (Max 5MB each)
              </p>
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Uploaded Photos ({formData.images.length}/10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                          Main Photo
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.images && <p className="text-sm text-error-600">{errors.images}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-2 text-primary-600" />
              Amenities & Room Types
            </h2>

            {/* Amenities by Category */}
            {['essential', 'comfort', 'convenience', 'safety', 'recreation'].map(category => {
              const categoryAmenities = amenityOptions.filter(amenity => amenity.category === category);
              if (categoryAmenities.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                    {category} Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categoryAmenities.map((amenity) => (
                      <button
                        key={amenity.value}
                        type="button"
                        onClick={() => handleAmenityChange(amenity.value)}
                        className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                          formData.amenities.includes(amenity.value)
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                        }`}
                      >
                        <div className="text-2xl mb-2">{amenity.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {amenity.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Room Types */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Available Room Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomTypeOptions.map((roomType) => (
                  <label
                    key={roomType.value}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.roomTypes.includes(roomType.value)
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {roomType.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {roomType.price}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.roomTypes.includes(roomType.value)}
                      onChange={() => handleRoomTypeChange(roomType.value)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {errors.amenities && <p className="text-sm text-error-600">{errors.amenities}</p>}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <HomeIcon className="w-6 h-6 mr-2 text-primary-600" />
              Rules & Final Details
            </h2>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                House Rules (Optional)
              </h3>
              <div className="space-y-3">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="e.g., No smoking inside the premises"
                      className="input flex-1"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="p-2 text-error-600 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRule}
                  className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Rule</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Listing Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">PG Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {formData.location.city}, {formData.location.state}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-medium text-primary-600 ml-2">₹{formData.price}/month</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Rooms:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">{formData.totalRooms}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2 capitalize">
                    {formData.gender === 'both' ? 'Co-ed' : formData.gender}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Amenities:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {formData.amenities.length} selected
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8 animate-fade-in">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white dark:bg-dark-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                Add New PG Listing
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fill in the details to create your PG listing
              </p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="card p-6 mb-8 animate-slide-down animate-delay-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      isCompleted
                        ? 'bg-success-600 text-white'
                        : isActive
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <div className={`text-sm font-medium ${
                        isActive || isCompleted 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Step {step.id}
                      </div>
                      <div className={`text-xs ${
                        isActive || isCompleted 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.name}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-12 h-1 mx-4 rounded-full transition-all duration-300 ${
                        currentStep > step.id ? 'bg-success-600' : 'bg-gray-200 dark:bg-dark-700'
                      }`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="card p-8 animate-zoom-in animate-delay-300">
            <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-dark-600 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Previous
                </button>

                {currentStep === steps.length ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Listing...
                      </div>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Create Listing
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Next Step
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPG;