const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getWishlist, toggleWishlist, getWishlistIds } = require('../controllers/wishlist.controller');

router.use(auth);
router.get('/', getWishlist);
router.get('/ids', getWishlistIds);
router.post('/', toggleWishlist);

module.exports = router;
