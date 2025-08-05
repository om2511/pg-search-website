const PG = require('../models/PG');

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
    const pg = await PG.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    res.json({
      success: true,
      data: pg
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG,
  getSearchSuggestions,
  getUserPGs
};