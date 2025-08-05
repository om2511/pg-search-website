const express = require('express');
const {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG,
  getSearchSuggestions,
  getUserPGs
} = require('../controllers/pgController');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAllPGs)
  .post(auth, createPG);

router.get('/search/suggestions', getSearchSuggestions);
router.get('/my-pgs', auth, getUserPGs);

router.route('/:id')
  .get(getPGById)
  .put(auth, updatePG)
  .delete(auth, deletePG);

module.exports = router;