import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { getAvatarUrl, getUserInitials } from '../../utils/imageUtils';
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Inquiries = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, replied
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInquiries = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/owner/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInquiries(Array.isArray(response.data.data) ? response.data.data : getMockInquiries());
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Set mock data for demo
      setInquiries(getMockInquiries());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchInquiries();
    }
  }, [user, fetchInquiries]);

  const getMockInquiries = () => [
    {
      _id: '1',
      user: {
        _id: 'user1',
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 9876543210',
        avatar: null
      },
      property: {
        _id: 'pg1',
        name: 'Sunshine Residency',
        location: { city: 'Mumbai', state: 'Maharashtra' }
      },
      message: 'Hi, I am interested in booking a room in your PG. Could you please share more details about the amenities and availability?',
      type: 'booking',
      status: 'unread',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      urgency: 'high'
    },
    {
      _id: '2',
      user: {
        _id: 'user2',
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 8765432109',
        avatar: null
      },
      property: {
        _id: 'pg2',
        name: 'Green Valley PG',
        location: { city: 'Pune', state: 'Maharashtra' }
      },
      message: 'Hello, I would like to know about the food facilities and timing restrictions for girls.',
      type: 'inquiry',
      status: 'replied',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      reply: 'Thank you for your interest. We provide 3 meals a day and have flexible timing for working women.',
      repliedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      urgency: 'medium'
    },
    {
      _id: '3',
      user: {
        _id: 'user3',
        name: 'Rahul Patel',
        email: 'rahul.patel@email.com',
        phone: '+91 7654321098',
        avatar: null
      },
      property: {
        _id: 'pg3',
        name: 'Metro Heights',
        location: { city: 'Bangalore', state: 'Karnataka' }
      },
      message: 'Is parking available? Also, what are the visiting hours for family members?',
      type: 'inquiry',
      status: 'unread',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      urgency: 'low'
    },
    {
      _id: '4',
      user: {
        _id: 'user4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '+91 6543210987',
        avatar: null
      },
      property: {
        _id: 'pg1',
        name: 'Sunshine Residency',
        location: { city: 'Mumbai', state: 'Maharashtra' }
      },
      message: 'I need to move in next week. Is there any room available immediately?',
      type: 'urgent',
      status: 'unread',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      urgency: 'high'
    }
  ];

  const markAsRead = async (inquiryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/owner/inquiries/${inquiryId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId ? { ...inquiry, status: 'read' } : inquiry
      ));
      
      showSuccess('Marked as read', 'Inquiry has been marked as read');
    } catch (error) {
      showError('Failed to update', error.response?.data?.message || 'Failed to mark as read');
    }
  };

  const replyToInquiry = async (inquiryId, replyMessage) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/owner/inquiries/${inquiryId}/reply`, 
        { message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId ? { 
          ...inquiry, 
          status: 'replied',
          reply: replyMessage,
          repliedAt: new Date()
        } : inquiry
      ));
      
      showSuccess('Reply sent', 'Your reply has been sent successfully');
    } catch (error) {
      showError('Failed to send reply', error.response?.data?.message || 'Failed to send reply');
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredInquiries = inquiries
    .filter(inquiry => {
      if (filter === 'unread') return inquiry.status === 'unread';
      if (filter === 'replied') return inquiry.status === 'replied';
      return true;
    })
    .filter(inquiry => 
      (inquiry.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (inquiry.property?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (inquiry.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
          <p className="text-gray-600 dark:text-gray-400">Loading inquiries...</p>
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
              Customer Inquiries
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and respond to customer inquiries
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 p-2 bg-white dark:bg-dark-800 rounded-xl shadow-sm">
          {[
            { key: 'all', label: 'All Inquiries', count: inquiries.length },
            { key: 'unread', label: 'Unread', count: inquiries.filter(i => i.status === 'unread').length },
            { key: 'replied', label: 'Replied', count: inquiries.filter(i => i.status === 'replied').length }
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

        {/* Inquiries List */}
        {filteredInquiries.length > 0 ? (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <InquiryCard 
                key={inquiry._id} 
                inquiry={inquiry} 
                onMarkAsRead={markAsRead}
                onReply={replyToInquiry}
                getTimeAgo={getTimeAgo}
                getUrgencyColor={getUrgencyColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Inquiries Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No inquiries match your search criteria' : 'You have no inquiries at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Inquiry Card Component
const InquiryCard = ({ inquiry, onMarkAsRead, onReply, getTimeAgo, getUrgencyColor }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Add null checks to prevent errors
  if (!inquiry || !inquiry.user || !inquiry.property) {
    return null;
  }

  const handleReply = (e) => {
    e.preventDefault();
    if (replyMessage.trim()) {
      onReply(inquiry._id, replyMessage);
      setReplyMessage('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`card p-6 ${inquiry.status === 'unread' ? 'border-l-4 border-primary-500' : ''}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* User Info & Message */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {inquiry.user?.avatar && getAvatarUrl(inquiry.user.avatar) ? (
                <img
                  src={getAvatarUrl(inquiry.user.avatar)}
                  alt={inquiry.user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-medium ${inquiry.user?.avatar && getAvatarUrl(inquiry.user.avatar) ? 'hidden' : 'flex'}`}
                style={{ display: inquiry.user?.avatar && getAvatarUrl(inquiry.user.avatar) ? 'none' : 'flex' }}
              >
                {inquiry.user?.name ? getUserInitials(inquiry.user.name) : <UserCircleIcon className="w-8 h-8" />}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {inquiry.user?.name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interested in: {inquiry.property?.name || 'Unknown Property'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(inquiry.urgency)}`}>
                    {inquiry.urgency} priority
                  </span>
                  {inquiry.status === 'unread' && (
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {inquiry.message}
              </p>
              
              {inquiry.reply && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-3">
                  <div className="flex items-center mb-1">
                    <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Your Reply ({getTimeAgo(inquiry.repliedAt)})
                    </span>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {inquiry.reply}
                  </p>
                </div>
              )}
              
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {getTimeAgo(inquiry.createdAt)}
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-1" />
                  {inquiry.user?.phone || 'No phone'}
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{inquiry.user?.email || 'No email'}</span>
                  <span className="sm:hidden">Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 flex-shrink-0">
          {inquiry.status === 'unread' && (
            <button
              onClick={() => onMarkAsRead(inquiry._id)}
              className="btn btn-outline btn-sm"
            >
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Mark Read
            </button>
          )}
          
          <a
            href={`tel:${inquiry.user?.phone || ''}`}
            className="btn btn-primary btn-sm flex items-center justify-center"
          >
            <PhoneIcon className="w-4 h-4 mr-1" />
            Call
          </a>
          
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="btn btn-outline btn-sm"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
            Reply
          </button>
        </div>
      </div>
      
      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReply} className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
            className="input w-full h-24 resize-none"
            required
          />
          <div className="flex space-x-2 mt-3">
            <button type="submit" className="btn btn-primary btn-sm">
              Send Reply
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowReplyForm(false);
                setReplyMessage('');
              }}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inquiries;
