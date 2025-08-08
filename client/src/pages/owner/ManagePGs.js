import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import {
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const ManagePGs = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, available, unavailable

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchPGs();
    }
  }, [user]);

  const fetchPGs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pgs/my-pgs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPgs(Array.isArray(response.data.data?.pgs) ? response.data.data.pgs : (Array.isArray(response.data.data) ? response.data.data : []));
    } catch (error) {
      console.error('Error fetching PGs:', error);
      setPgs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePG = async (pgId, pgName) => {
    if (!window.confirm(`Are you sure you want to delete "${pgName}"? This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/pgs/${pgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showSuccess('PG Deleted', 'Your PG listing has been deleted successfully');
      fetchPGs(); // Refresh data
    } catch (error) {
      showError('Delete Failed', error.response?.data?.message || 'Failed to delete PG');
    }
  };

  const togglePGStatus = async (pgId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/pgs/${pgId}/status`, {
        availability: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showSuccess('Status Updated', `PG is now ${!currentStatus ? 'available' : 'unavailable'}`);
      fetchPGs(); // Refresh data
    } catch (error) {
      showError('Update Failed', error.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredPGs = pgs.filter(pg => {
    switch (filter) {
      case 'available': return pg.availability;
      case 'unavailable': return !pg.availability;
      default: return true;
    }
  });

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
          <p className="text-gray-600 dark:text-gray-400">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="container-responsive px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Properties
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your PG listings from one place
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
            <Link
              to="/add-pg"
              className="btn btn-primary flex items-center justify-center"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add New PG
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 p-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm">
          {[
            { key: 'all', label: 'All Properties', count: pgs.length },
            { key: 'available', label: 'Available', count: pgs.filter(pg => pg.availability).length },
            { key: 'unavailable', label: 'Unavailable', count: pgs.filter(pg => !pg.availability).length }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === filterOption.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>

        {/* PG List */}
        {filteredPGs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPGs.map((pg) => (
              <div
                key={pg._id}
                className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pg.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={pg.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pg.availability 
                        ? 'bg-success-500 text-white' 
                        : 'bg-error-500 text-white'
                    }`}>
                      {pg.availability ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {pg.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {pg.location?.city}, {pg.location?.state}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{pg.price?.toLocaleString()}/month
                    </span>
                    <span className="text-sm text-gray-500">
                      {pg.availableRooms || 0}/{pg.totalRooms || 0} rooms
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      <span>{Math.floor(Math.random() * 300) + 50} views</span>
                    </div>
                    <div className="text-right text-gray-600 dark:text-gray-400">
                      Updated: {new Date(pg.updatedAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => togglePGStatus(pg._id, pg.availability)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pg.availability 
                          ? 'bg-success-100 dark:bg-success-900/20 text-success-700 dark:text-success-400 hover:bg-success-200' 
                          : 'bg-error-100 dark:bg-error-900/20 text-error-700 dark:text-error-400 hover:bg-error-200'
                      }`}
                    >
                      {pg.availability ? (
                        <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 inline mr-1" />
                      )}
                      {pg.availability ? 'Available' : 'Unavailable'}
                    </button>
                    
                    <Link
                      to={`/edit-pg/${pg._id}`}
                      className="p-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      to={`/pg/${pg._id}`}
                      className="p-2 bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDeletePG(pg._id, pg.name)}
                      className="p-2 bg-error-100 dark:bg-error-900/20 text-error-600 rounded-lg hover:bg-error-200 dark:hover:bg-error-900/40 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'No Properties Found' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Properties`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Start by adding your first PG listing' 
                : `You don't have any ${filter} properties at the moment`
              }
            </p>
            {filter === 'all' && (
              <Link to="/add-pg" className="btn btn-primary">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Your First PG
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePGs;