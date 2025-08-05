const mongoose = require('mongoose');

const PGSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['boys', 'girls', 'both'],
    required: true
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'tv', 'fridge', 'washing_machine', 'parking', 'security', 'meals', 'cleaning', 'gym']
  }],
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  rules: [String],
  availability: {
    type: Boolean,
    default: true
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 1
  },
  availableRooms: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

PGSchema.index({ 'location.city': 1, gender: 1, price: 1 });

module.exports = mongoose.model('PG', PGSchema);