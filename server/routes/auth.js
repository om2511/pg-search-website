const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist, 
  checkWishlistStatus,
  clearWishlist
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

// Wishlist routes
router.get('/wishlist', auth, getWishlist);
router.post('/wishlist/:pgId', auth, addToWishlist);
router.delete('/wishlist/:pgId', auth, removeFromWishlist);
router.delete('/wishlist', auth, clearWishlist);
router.get('/wishlist/check/:pgId', auth, checkWishlistStatus);

module.exports = router;