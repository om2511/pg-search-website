const Inquiry = require('../models/Inquiry');
const PG = require('../models/PG');
const User = require('../models/User');

// Create new inquiry
const createInquiry = async (req, res) => {
  try {
    const { pgId, message, contactDetails, checkInDate, duration, budget } = req.body;

    // Get PG details to find owner
    const pg = await PG.findById(pgId).populate('owner');
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    const inquiry = new Inquiry({
      pg: pgId,
      user: req.user._id,
      owner: pg.owner._id,
      message,
      contactDetails,
      checkInDate,
      duration,
      budget
    });

    await inquiry.save();
    await inquiry.populate([
      { path: 'pg', select: 'name location price' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiries for owner
const getOwnerInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const inquiries = await Inquiry.find(filter)
      .populate('pg', 'name location price images')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments(filter);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiries for user
const getUserInquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const inquiries = await Inquiry.find({ user: req.user._id })
      .populate('pg', 'name location price images')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to inquiry
const respondToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const inquiry = await Inquiry.findOne({ _id: id, owner: req.user._id });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.ownerResponse = {
      message,
      respondedAt: new Date()
    };
    inquiry.status = 'responded';

    await inquiry.save();
    await inquiry.populate([
      { path: 'pg', select: 'name location price' },
      { path: 'user', select: 'name email' }
    ]);

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const inquiry = await Inquiry.findOne({ _id: id, owner: req.user._id });
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;

    await inquiry.save();

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiry analytics
const getInquiryAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const analytics = await Inquiry.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          responded: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);

    const monthlyData = await Inquiry.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics[0] || { total: 0, pending: 0, responded: 0, resolved: 0, closed: 0 },
        monthlyData: monthlyData.reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInquiry,
  getOwnerInquiries,
  getUserInquiries,
  respondToInquiry,
  updateInquiryStatus,
  getInquiryAnalytics
};