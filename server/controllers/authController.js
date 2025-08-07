const User = require('../models/User');
const PG = require('../models/PG');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Wishlist Management
const addToWishlist = async (req, res) => {
  try {
    const { pgId } = req.params;
    const userId = req.user._id;
    
    // Check if PG exists
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }
    
    // Check if already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(pgId)) {
      return res.status(400).json({ message: 'PG already in wishlist' });
    }
    
    // Add to wishlist
    user.wishlist.push(pgId);
    await user.save();
    
    res.json({
      success: true,
      message: 'PG added to wishlist',
      data: { wishlistCount: user.wishlist.length }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { pgId } = req.params;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== pgId);
    await user.save();
    
    res.json({
      success: true,
      message: 'PG removed from wishlist',
      data: { wishlistCount: user.wishlist.length }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const userId = req.user._id;
    
    const user = await User.findById(userId).populate({
      path: 'wishlist',
      populate: {
        path: 'owner',
        select: 'name phone email'
      },
      options: {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit)
      }
    });
    
    const total = user.wishlist.length;
    
    res.json({
      success: true,
      data: {
        pgs: user.wishlist,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkWishlistStatus = async (req, res) => {
  try {
    const { pgId } = req.params;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    const isWishlisted = user.wishlist.includes(pgId);
    
    res.json({
      success: true,
      data: { isWishlisted }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    user.wishlist = [];
    await user.save();
    
    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: { wishlistCount: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profile Update
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, bio, location, preferences } = req.body;
    
    const updateData = {
      name,
      phone,
      bio,
      location,
      preferences
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Avatar Upload
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('Avatar upload request:', { userId, file: req.file ? req.file.filename : 'No file' });
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }
    
    // Create avatar URL
    const avatarUrl = `/uploads/${req.file.filename}`;
    console.log('Generated avatar URL:', avatarUrl);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    console.log('Avatar updated for user:', user.name, 'Avatar URL:', user.avatar);
    
    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar,
        user: user
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Password Update
const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  uploadAvatar,
  updatePassword,
  addToWishlist, 
  removeFromWishlist, 
  getWishlist, 
  checkWishlistStatus,
  clearWishlist
};