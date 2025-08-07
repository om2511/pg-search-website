const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
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
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Multer configuration for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

// Profile management routes
router.put('/profile', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.put('/password', auth, updatePassword);

// Wishlist routes
router.get('/wishlist', auth, getWishlist);
router.post('/wishlist/:pgId', auth, addToWishlist);
router.delete('/wishlist/:pgId', auth, removeFromWishlist);
router.delete('/wishlist', auth, clearWishlist);
router.get('/wishlist/check/:pgId', auth, checkWishlistStatus);

module.exports = router;