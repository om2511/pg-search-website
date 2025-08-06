const PG = require('../models/PG');
const Review = require('../models/Review');
const mongoose = require('mongoose');

const createPG = async (req, res) => {
  try {
    const pgData = {
      ...req.body,
      owner: req.user._id,
      availableRooms: req.body.totalRooms
    };

    const pg = new PG(pgData);
    await pg.save();
    await pg.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      data: pg
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPGs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 8, 
      city, 
      gender, 
      minPrice, 
      maxPrice, 
      amenities,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const filter = { availability: true };
    
    // Search functionality - search in name, description, city
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.address': searchRegex }
      ];
    }
    
    // Location filter
    if (city && city.trim()) {
      filter['location.city'] = new RegExp(city.trim(), 'i');
    }
    
    // Gender filter
    if (gender && gender !== 'all') {
      filter.gender = { $in: [gender, 'both'] };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Amenities filter
    if (amenities && amenities.length > 0) {
      const amenityArray = Array.isArray(amenities) ? amenities : amenities.split(',');
      filter.amenities = { $all: amenityArray };
    }

    // Sorting
    const sortOptions = {};
    if (sortBy === 'price') {
      sortOptions.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pgs = await PG.find(filter)
      .populate('owner', 'name phone email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await PG.countDocuments(filter);

    res.json({
      success: true,
      data: {
        pgs,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPGById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid PG ID format' 
      });
    }

    const pg = await PG.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!pg) {
      return res.status(404).json({ 
        success: false, 
        message: 'PG not found' 
      });
    }

    res.json({
      success: true,
      data: pg
    });
  } catch (error) {
    console.error('Error fetching PG details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const updatePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPG = await PG.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      data: updatedPG
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await PG.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'PG deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get search suggestions
const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    // Get unique cities
    const cities = await PG.distinct('location.city', {
      'location.city': searchRegex,
      availability: true
    });

    // Get PG names
    const pgNames = await PG.find({
      name: searchRegex,
      availability: true
    }).select('name').limit(5);

    const suggestions = [
      ...cities.map(city => ({ type: 'city', value: city })),
      ...pgNames.map(pg => ({ type: 'pg', value: pg.name }))
    ].slice(0, 8);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's PGs
const getUserPGs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pgs = await PG.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await PG.countDocuments({ owner: req.user._id });

    res.json({
      success: true,
      data: {
        pgs,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular locations
const getPopularLocations = async (req, res) => {
  try {
    const locations = await PG.aggregate([
      { $match: { availability: true } },
      { $group: { 
          _id: '$location.city', 
          count: { $sum: 1 } 
        } 
      },
      { $project: { 
          city: '$_id', 
          count: 1, 
          _id: 0 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a PG
const getPGReviews = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid PG ID format' 
      });
    }

    const { page = 1, limit = 10 } = req.query;
    
    // Check if PG exists
    const pgExists = await PG.findById(req.params.id);
    if (!pgExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'PG not found' 
      });
    }
    
    const reviews = await Review.find({ pg: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({ pg: req.params.id });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { pg: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        } 
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating : 0,
        totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0
      }
    });
  } catch (error) {
    console.error('Error fetching PG reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Create a review for a PG
const createReview = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid PG ID format' 
      });
    }

    // Check if PG exists
    const pgExists = await PG.findById(req.params.id);
    if (!pgExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'PG not found' 
      });
    }

    const { rating, comment } = req.body;
    
    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating and comment are required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Check if user already reviewed this PG
    const existingReview = await Review.findOne({
      pg: req.params.id,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already reviewed this PG' 
      });
    }

    const review = new Review({
      pg: req.params.id,
      user: req.user._id,
      rating,
      comment
    });

    await review.save();
    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get similar PGs
const getSimilarPGs = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid PG ID format' 
      });
    }

    const pg = await PG.findById(req.params.id);
    
    if (!pg) {
      return res.status(404).json({ 
        success: false, 
        message: 'PG not found' 
      });
    }

    // Find similar PGs based on location, price range, and gender
    const priceRange = pg.price * 0.3; // 30% price variance
    
    const similarPGs = await PG.find({
      _id: { $ne: req.params.id }, // Exclude current PG
      availability: true,
      'location.city': pg.location.city,
      gender: { $in: [pg.gender, 'both'] },
      price: {
        $gte: pg.price - priceRange,
        $lte: pg.price + priceRange
      }
    })
    .populate('owner', 'name phone email')
    .limit(6)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: similarPGs
    });
  } catch (error) {
    console.error('Error fetching similar PGs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG,
  getSearchSuggestions,
  getUserPGs,
  getPopularLocations,
  getPGReviews,
  createReview,
  getSimilarPGs
};