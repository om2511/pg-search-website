const express = require('express');
const {
  createInquiry,
  getOwnerInquiries,
  getUserInquiries,
  respondToInquiry,
  updateInquiryStatus,
  getInquiryAnalytics
} = require('../controllers/inquiryController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create new inquiry
router.post('/', createInquiry);

// Get inquiries for current user
router.get('/my-inquiries', getUserInquiries);

// Get inquiries for owner
router.get('/owner', getOwnerInquiries);

// Get inquiry analytics for owner
router.get('/analytics', getInquiryAnalytics);

// Respond to inquiry
router.patch('/:id/respond', respondToInquiry);

// Update inquiry status
router.patch('/:id/status', updateInquiryStatus);

module.exports = router;