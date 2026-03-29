const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  getProducts, getFeaturedProducts, getCategories,
  getProductById, addReview, getBrands
} = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/:id', getProductById);
router.post('/:id/review', auth, addReview);

module.exports = router;
