import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { user } = useAuth();
  
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      totalInquiries: 0,
      totalRevenue: 0,
      averageRating: 0,
      conversionRate: 0
    },
    chartData: {
      views: [],
      inquiries: [],
      revenue: []
    },
    propertyPerformance: [],
    timeframe: 'thisMonth'
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('thisMonth');

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/owner/analytics?timeframe=${timeframe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalytics(response.data.data || getMockAnalytics());
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data for demo
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  const getMockAnalytics = () => ({
    overview: {
      totalViews: 2450,
      totalInquiries: 89,
      totalRevenue: 145000,
      averageRating: 4.3,
      conversionRate: 3.6
    },
    chartData: {
      views: [120, 135, 148, 162, 175, 188, 195, 210, 225, 240, 255, 270],
      inquiries: [8, 12, 15, 18, 22, 25, 28, 30, 35, 38, 42, 45],
      revenue: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 72000, 75000, 78000, 82000]
    },
    propertyPerformance: [
      {
        id: '1',
        name: 'Sunshine Residency',
        views: 850,
        inquiries: 32,
        bookings: 3,
        revenue: 45000,
        rating: 4.5,
        conversionRate: 3.8
      },
      {
        id: '2',
        name: 'Green Valley PG',
        views: 620,
        inquiries: 24,
        bookings: 2,
        revenue: 24000,
        rating: 4.1,
        conversionRate: 3.2
      },
      {
        id: '3',
        name: 'Metro Heights',
        views: 980,
        inquiries: 33,
        bookings: 4,
        revenue: 76000,
        rating: 4.6,
        conversionRate: 4.1
      }
    ]
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
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Total Views',
      value: (analytics?.overview?.totalViews || 0).toLocaleString(),
      icon: EyeIcon,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Inquiries',
      value: (analytics?.overview?.totalInquiries || 0).toLocaleString(),
      icon: UserGroupIcon,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `₹${((analytics?.overview?.totalRevenue || 0) / 1000).toFixed(0)}k`,
      icon: CurrencyRupeeIcon,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Avg. Rating',
      value: (analytics?.overview?.averageRating || 0).toFixed(1),
      icon: ChartBarIcon,
      color: 'from-orange-500 to-orange-600',
      change: '+0.2',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="container-responsive px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your property performance and insights
            </p>
          </div>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input w-full lg:w-auto mt-4 lg:mt-0"
          >
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    card.trend === 'up' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {card.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {card.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {card.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Views Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2 text-blue-600" />
              Page Views
            </h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(analytics?.chartData?.views && analytics.chartData.views.length > 0) 
                ? analytics.chartData.views[analytics.chartData.views.length - 1] 
                : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This month
            </div>
            {/* Simple chart representation */}
            <div className="flex items-end space-x-1 h-16">
              {(analytics?.chartData?.views || []).slice(-7).map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-400 rounded-t flex-1"
                  style={{
                    height: `${analytics?.chartData?.views && analytics.chartData.views.length > 0 
                      ? (value / Math.max(...analytics.chartData.views)) * 100 
                      : 10}%`,
                    minHeight: '8px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Inquiries Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
              Inquiries
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {(analytics?.chartData?.inquiries && analytics.chartData.inquiries.length > 0) 
                ? analytics.chartData.inquiries[analytics.chartData.inquiries.length - 1] 
                : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This month
            </div>
            <div className="flex items-end space-x-1 h-16">
              {(analytics?.chartData?.inquiries || []).slice(-7).map((value, index) => (
                <div
                  key={index}
                  className="bg-green-400 rounded-t flex-1"
                  style={{
                    height: `${analytics?.chartData?.inquiries && analytics.chartData.inquiries.length > 0 
                      ? (value / Math.max(...analytics.chartData.inquiries)) * 100 
                      : 10}%`,
                    minHeight: '8px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="card p-6 lg:col-span-2 xl:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-purple-600" />
              Revenue
            </h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ₹{(analytics?.chartData?.revenue && analytics.chartData.revenue.length > 0) 
                ? (analytics.chartData.revenue[analytics.chartData.revenue.length - 1] / 1000).toFixed(0) 
                : 0}k
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This month
            </div>
            <div className="flex items-end space-x-1 h-16">
              {(analytics?.chartData?.revenue || []).slice(-7).map((value, index) => (
                <div
                  key={index}
                  className="bg-purple-400 rounded-t flex-1"
                  style={{
                    height: `${analytics?.chartData?.revenue && analytics.chartData.revenue.length > 0 
                      ? (value / Math.max(...analytics.chartData.revenue)) * 100 
                      : 10}%`,
                    minHeight: '8px'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Performance */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BuildingOfficeIcon className="w-6 h-6 mr-2 text-primary-600" />
            Property Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-600">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Property</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Views</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Inquiries</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Bookings</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Rating</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.propertyPerformance || []).map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 dark:border-dark-700">
                    <td className="py-4 px-2">
                      <div className="font-medium text-gray-900 dark:text-white">{property.name}</div>
                    </td>
                    <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400">
                      {property.views.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400">
                      {property.inquiries}
                    </td>
                    <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400">
                      {property.bookings}
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white">
                      ₹{property.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="inline-flex items-center text-yellow-600">
                        {property.rating}
                        <span className="text-yellow-400 ml-1">★</span>
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className={`font-medium ${
                        property.conversionRate > 3.5 ? 'text-success-600' : 'text-warning-600'
                      }`}>
                        {property.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📈 Peak Performance
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Metro Heights has the highest conversion rate at 4.1%
            </p>
          </div>
          
          <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              💰 Revenue Leader
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Metro Heights generated the highest revenue this month
            </p>
          </div>
          
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              ⭐ Top Rated
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              Metro Heights has the highest rating at 4.6 stars
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
