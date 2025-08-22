const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  pg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  contactDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  checkInDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    enum: ['1-3 months', '3-6 months', '6-12 months', '1+ years'],
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'resolved', 'closed'],
    default: 'pending'
  },
  ownerResponse: {
    message: String,
    respondedAt: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
InquirySchema.index({ owner: 1, status: 1 });
InquirySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', InquirySchema);