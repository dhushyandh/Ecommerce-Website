const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const upload = require("../middlewares/upload");


router.route('/products').get(getProducts);
router.route('/product/:id')
    .get(getSingleProduct)
    .put(updateProduct);
router.route('/review').put(isAuthenticatedUser, createReview)




// Admin Route
router.route('/admin/products/new').post(isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), newProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/products/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/admin/products/:id').put(isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), updateProduct);
router.route('/admin/reviews').get(isAuthenticatedUser, authorizeRoles('admin'), getReviews)
router.route('/admin/review').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.post("/products/new", isAuthenticatedUser, authorizeRoles("admin"), upload.array("images"), createProduct);

module.exports = router;