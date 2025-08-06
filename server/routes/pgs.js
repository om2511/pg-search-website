const express = require('express');
const {
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
} = require('../controllers/pgController');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAllPGs)
  .post(auth, createPG);

router.get('/search/suggestions', getSearchSuggestions);
router.get('/popular-locations', getPopularLocations);
router.get('/my-pgs', auth, getUserPGs);

// Similar PGs route (must come before /:id to avoid conflicts)
router.get('/similar/:id', getSimilarPGs);

router.route('/:id')
  .get(getPGById)
  .put(auth, updatePG)
  .delete(auth, deletePG);

// Review routes
router.route('/:id/reviews')
  .get(getPGReviews)
  .post(auth, createReview);

module.exports = router;