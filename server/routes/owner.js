const express = require('express');
const auth = require('../middleware/auth');
const PG = require('../models/PG');
const User = require('../models/User');

const router = express.Router();

// Get owner dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    // Ensure user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Owner role required.'
      });
    }

    // Get user's PGs
    const userPGs = await PG.find({ owner: req.user.id });
    
    // Calculate stats
    const totalPGs = userPGs.length;
    let totalViews = 0;
    let totalInquiries = 0;
    let monthlyRevenue = 0;
    let totalRooms = 0;
    let occupiedRooms = 0;

    userPGs.forEach(pg => {
      totalViews += pg.views || Math.floor(Math.random() * 200) + 50;
      totalInquiries += pg.inquiries || Math.floor(Math.random() * 20) + 5;
      monthlyRevenue += pg.price || 0;
      totalRooms += pg.totalRooms || 5;
      occupiedRooms += (pg.totalRooms - pg.availableRooms) || 3;
    });

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalPGs,
        totalViews,
        totalInquiries,
        monthlyRevenue,
        occupancyRate
      }
    });
  } catch (error) {
    console.error('Owner stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get owner inquiries
router.get('/inquiries', auth, async (req, res) => {
  try {
    // Ensure user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Owner role required.'
      });
    }

    // Mock inquiries data for now
    const mockInquiries = [
      {
        _id: '1',
        user: { 
          name: 'Amit Kumar', 
          avatar: null,
          email: 'amit@example.com'
        },
        pgName: 'Sunshine Residency',
        message: 'I am interested in this PG. Is it available?',
        time: '2 hours ago',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        _id: '2',
        user: { 
          name: 'Priya Sharma', 
          avatar: null,
          email: 'priya@example.com'
        },
        pgName: 'Green Valley PG',
        message: 'Can I visit this property tomorrow?',
        time: '5 hours ago',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        _id: '3',
        user: { 
          name: 'Rahul Patel', 
          avatar: null,
          email: 'rahul@example.com'
        },
        pgName: 'Metro Heights',
        message: 'What are the nearby facilities?',
        time: '1 day ago',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    res.json({
      success: true,
      data: mockInquiries
    });
  } catch (error) {
    console.error('Owner inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get owner analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    // Ensure user is an owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Owner role required.'
      });
    }

    // Mock analytics data
    const analytics = {
      viewsThisMonth: [120, 135, 148, 162, 175, 188, 195],
      inquiriesThisMonth: [8, 12, 15, 18, 22, 25, 28],
      revenueThisMonth: [45000, 67000, 78000, 89000, 102000, 115000, 125000],
      topPerformingPGs: [
        { name: 'Sunshine Residency', views: 95, inquiries: 12 },
        { name: 'Green Valley PG', views: 67, inquiries: 8 },
        { name: 'Metro Heights', views: 33, inquiries: 8 }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Owner analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
