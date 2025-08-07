import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CalendarIcon,
  PhoneIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPGs: 0,
      totalViews: 0,
      totalInquiries: 0,
      monthlyRevenue: 0,
      occupancyRate: 0
    },
    recentPGs: [],
    recentInquiries: [],
    analytics: {
      viewsThisMonth: [],
      inquiriesThisMonth: [],
      revenueThisMonth: []
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('thisMonth');

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, pgsRes, inquiriesRes] = await Promise.all([
        axios.get('/api/owner/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/pgs/my-pgs', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/owner/inquiries', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setDashboardData({
        stats: statsRes.data.data || {
          totalPGs: 3,
          totalViews: 1245,
          totalInquiries: 67,
          monthlyRevenue: 125000,
          occupancyRate: 85
        },
        recentPGs: Array.isArray(pgsRes.data.data?.pgs) ? pgsRes.data.data.pgs : (Array.isArray(pgsRes.data.data) ? pgsRes.data.data : mockPGs),
        recentInquiries: Array.isArray(inquiriesRes.data.data) ? inquiriesRes.data.data : mockInquiries,
        analytics: {
          viewsThisMonth: [120, 135, 148, 162, 175, 188, 195],
          inquiriesThisMonth: [8, 12, 15, 18, 22, 25, 28],
          revenueThisMonth: [45000, 67000, 78000, 89000, 102000, 115000, 125000]
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demo
      setDashboardData({
        stats: {
          totalPGs: 3,
          totalViews: 1245,
          totalInquiries: 67,
          monthlyRevenue: 125000,
          occupancyRate: 85
        },
        recentPGs: mockPGs,
        recentInquiries: mockInquiries,
        analytics: {
          viewsThisMonth: [120, 135, 148, 162, 175, 188, 195],
          inquiriesThisMonth: [8, 12, 15, 18, 22, 25, 28],
          revenueThisMonth: [45000, 67000, 78000, 89000, 102000, 115000, 125000]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePG = async (pgId) => {
    if (!window.confirm('Are you sure you want to delete this PG listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/pgs/${pgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showSuccess('PG Deleted', 'Your PG listing has been deleted successfully');
      fetchDashboardData(); // Refresh data
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
      fetchDashboardData(); // Refresh data
    } catch (error) {
      showError('Update Failed', error.response?.data?.message || 'Failed to update status');
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
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: dashboardData.stats.totalPGs,
      icon: BuildingOfficeIcon,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this month',
      trend: 'up'
    },
    {
      title: 'Total Views',
      value: dashboardData.stats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'from-green-500 to-green-600',
      change: '+12% this month',
      trend: 'up'
    },
    {
      title: 'Inquiries',
      value: dashboardData.stats.totalInquiries,
      icon: PhoneIcon,
      color: 'from-purple-500 to-purple-600',
      change: '+8 this week',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(dashboardData.stats.monthlyRevenue / 1000).toFixed(0)}k`,
      icon: CurrencyRupeeIcon,
      color: 'from-orange-500 to-orange-600',
      change: '+5% this month',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-4 md:py-8">
      <div className="container-responsive px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 md:mb-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
              Here's what's happening with your properties today
            </p>
          </div>
          
          <Link
            to="/add-pg"
            className="btn btn-primary btn-lg w-full sm:w-auto mt-4 lg:mt-0 animate-slide-left animate-delay-200"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New PG
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="card p-4 md:p-6 animate-bounce-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-xs md:text-sm font-medium ${
                    stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    )}
                    <span className="hidden sm:inline">{stat.change}</span>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Recent PGs */}
          <div className="xl:col-span-2">
            <div className="card p-4 md:p-6 animate-slide-up animate-delay-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary-600" />
                  Your Properties
                </h2>
                <Link to="/owner/manage-pgs" className="btn btn-outline btn-sm w-full sm:w-auto">
                  Manage All
                </Link>
              </div>

              <div className="space-y-4">
                {(Array.isArray(dashboardData.recentPGs) ? dashboardData.recentPGs : []).map((pg, index) => (
                  <div 
                    key={pg._id || index}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors space-y-3 lg:space-y-0"
                  >
                    <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                      <img
                        src={pg.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80'}
                        alt={pg.name}
                        className="w-12 h-12 md:w-15 md:h-15 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">
                          {pg.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm truncate">
                          {pg.location?.city}, {pg.location?.state}
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-medium text-sm md:text-base">
                          ₹{pg.price?.toLocaleString()}/month
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between lg:justify-end space-x-2 lg:space-x-4">
                      <div className="text-right lg:mr-4 flex-shrink-0">
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {pg.availableRooms || 2}/{pg.totalRooms || 5} rooms
                        </div>
                        <div className="flex items-center text-xs md:text-sm">
                          <EyeIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {Math.floor(Math.random() * 200) + 50} views
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                        <button
                          onClick={() => togglePGStatus(pg._id, pg.availability)}
                          className={`p-1.5 md:p-2 rounded-lg transition-all duration-300 ${
                            pg.availability 
                              ? 'bg-success-100 dark:bg-success-900/20 text-success-600 hover:bg-success-200' 
                              : 'bg-error-100 dark:bg-error-900/20 text-error-600 hover:bg-error-200'
                          }`}
                          title={pg.availability ? 'Available' : 'Unavailable'}
                        >
                          {pg.availability ? (
                            <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <XCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </button>
                        
                        <Link
                          to={`/edit-pg/${pg._id}`}
                          className="p-1.5 md:p-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                        >
                          <PencilIcon className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                        
                        <Link
                          to={`/pg/${pg._id}`}
                          className="p-1.5 md:p-2 bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors"
                        >
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 md:w-4 md:h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeletePG(pg._id)}
                          className="p-1.5 md:p-2 bg-error-100 dark:bg-error-900/20 text-error-600 rounded-lg hover:bg-error-200 dark:hover:bg-error-900/40 transition-colors"
                        >
                          <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(Array.isArray(dashboardData.recentPGs) ? dashboardData.recentPGs : []).length === 0 && (
                <div className="text-center py-8 md:py-12">
                  <BuildingOfficeIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Properties Yet
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                    Start by adding your first PG listing
                  </p>
                  <Link to="/add-pg" className="btn btn-primary w-full sm:w-auto">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add Your First PG
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Recent Inquiries */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <div className="card p-4 md:p-6 animate-slide-left animate-delay-400">
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/add-pg"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/40 dark:hover:to-secondary-900/40 transition-all duration-300 group"
                >
                  <PlusCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-primary-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Add New PG</span>
                </Link>
                
                <Link
                  to="/owner/analytics"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/40 dark:hover:to-teal-900/40 transition-all duration-300 group"
                >
                  <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">View Analytics</span>
                </Link>
                
                <Link
                  to="/owner/inquiries"
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-300 group"
                >
                  <UserGroupIcon className="w-5 h-5 md:w-6 md:h-6 text-purple-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">Manage Inquiries</span>
                </Link>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="card p-4 md:p-6 animate-slide-left animate-delay-500">
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
                Recent Inquiries
              </h3>

              <div className="space-y-3">
                {(Array.isArray(dashboardData.recentInquiries) ? dashboardData.recentInquiries : []).slice(0, 5).map((inquiry, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img
                        src={inquiry.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80'}
                        alt={inquiry.user?.name}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-xs md:text-sm truncate">
                          {inquiry.user?.name || 'John Doe'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                          {inquiry.pgName || 'Sunshine Residency'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {inquiry.time || '2 hours ago'}
                      </div>
                      <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(Array.isArray(dashboardData.recentInquiries) ? dashboardData.recentInquiries : []).length === 0 && (
                <div className="text-center py-6 md:py-8">
                  <UserGroupIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No inquiries yet</p>
                </div>
              )}
            </div>

            {/* Performance Overview */}
            <div className="card p-4 md:p-6 animate-slide-left animate-delay-600">
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                Performance
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                  <span className="font-bold text-green-600 text-sm md:text-base">{dashboardData.stats.occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${dashboardData.stats.occupancyRate}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">Avg. Rating</span>
                  <div className="flex items-center">
                    <StarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mr-1" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base">4.2</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base">2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-6 md:mt-8 card p-4 md:p-6 animate-slide-up animate-delay-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600" />
              Analytics Overview
            </h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="input w-full sm:w-auto text-sm md:text-base"
            >
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {/* Views Chart */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 md:p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <EyeIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                <span className="text-sm md:text-base">Page Views</span>
              </h3>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {dashboardData.analytics.viewsThisMonth[dashboardData.analytics.viewsThisMonth.length - 1]}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                +12% from last month
              </div>
              {/* Simple chart representation */}
              <div className="mt-4 flex items-end space-x-1 h-12 md:h-16">
                {dashboardData.analytics.viewsThisMonth.map((value, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 rounded-t"
                    style={{
                      height: `${(value / Math.max(...dashboardData.analytics.viewsThisMonth)) * 100}%`,
                      width: '14.28%'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Inquiries Chart */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 md:p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
                <span className="text-sm md:text-base">Inquiries</span>
              </h3>
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                {dashboardData.analytics.inquiriesThisMonth[dashboardData.analytics.inquiriesThisMonth.length - 1]}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                +8% from last month
              </div>
              <div className="mt-4 flex items-end space-x-1 h-12 md:h-16">
                {dashboardData.analytics.inquiriesThisMonth.map((value, index) => (
                  <div
                    key={index}
                    className="bg-purple-400 rounded-t"
                    style={{
                      height: `${(value / Math.max(...dashboardData.analytics.inquiriesThisMonth)) * 100}%`,
                      width: '14.28%'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 md:p-6 rounded-xl md:col-span-2 xl:col-span-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CurrencyRupeeIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                <span className="text-sm md:text-base">Revenue</span>
              </h3>
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                ₹{(dashboardData.analytics.revenueThisMonth[dashboardData.analytics.revenueThisMonth.length - 1] / 1000).toFixed(0)}k
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                +5% from last month
              </div>
              <div className="mt-4 flex items-end space-x-1 h-12 md:h-16">
                {dashboardData.analytics.revenueThisMonth.map((value, index) => (
                  <div
                    key={index}
                    className="bg-green-400 rounded-t"
                    style={{
                      height: `${(value / Math.max(...dashboardData.analytics.revenueThisMonth)) * 100}%`,
                      width: '14.28%'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Recommendations */}
        <div className="mt-6 md:mt-8 card p-4 md:p-6 animate-fade-in animate-delay-1000">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center">
            💡 Tips to Improve Your Listings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm md:text-base">
                📸 Add More Photos
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-xs md:text-sm">
                Properties with 5+ photos get 40% more inquiries
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm md:text-base">
                ⚡ Enable Instant Booking
              </h3>
              <p className="text-green-700 dark:text-green-300 text-xs md:text-sm">
                Get 60% more bookings with instant booking feature
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 md:col-span-2 xl:col-span-1">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm md:text-base">
                💬 Respond Quickly
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-xs md:text-sm">
                Reply within 2 hours to increase booking chances by 3x
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for demo
const mockPGs = [
  {
    _id: '1',
    name: 'Sunshine Residency',
    location: { city: 'Mumbai', state: 'Maharashtra' },
    price: 15000,
    totalRooms: 10,
    availableRooms: 3,
    availability: true,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
  },
  {
    _id: '2',
    name: 'Green Valley PG',
    location: { city: 'Pune', state: 'Maharashtra' },
    price: 12000,
    totalRooms: 8,
    availableRooms: 1,
    availability: true,
    images: ['https://images.unsplash.com/photo-1540518614846-7eded47c0419?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
  },
  {
    _id: '3',
    name: 'Metro Heights',
    location: { city: 'Bangalore', state: 'Karnataka' },
    price: 18000,
    totalRooms: 12,
    availableRooms: 0,
    availability: false,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
  }
];

const mockInquiries = [
  {
    user: { name: 'Amit Kumar', avatar: null },
    pgName: 'Sunshine Residency',
    time: '2 hours ago'
  },
  {
    user: { name: 'Priya Sharma', avatar: null },
    pgName: 'Green Valley PG',
    time: '5 hours ago'
  },
  {
    user: { name: 'Rahul Patel', avatar: null },
    pgName: 'Metro Heights',
    time: '1 day ago'
  }
];

export default OwnerDashboard;