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
    const { page = 1, limit = 12, city, gender, minPrice, maxPrice, amenities } = req.query;
    
    const filter = { availability: true };
    
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (gender) filter.gender = { $in: [gender, 'both'] };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (amenities) {
      const amenityArray = amenities.split(',');
      filter.amenities = { $in: amenityArray };
    }

    const pgs = await PG.find(filter)
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PG.countDocuments(filter);

    res.json({
      success: true,
      data: {
        pgs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
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

module.exports = {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG
};