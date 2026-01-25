const express = require('express');
const router = express.Router();

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getReviews,
    deleteReview,
    getAdminProducts
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Public
router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);

// Review
router.put('/review', isAuthenticatedUser, createReview);

// Admin
router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

router.post(
    '/admin/products/new',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.array('images'),
    newProduct
);

router.put(
    '/admin/products/:id',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    upload.array('images'),
    updateProduct
);

router.delete(
    '/admin/products/:id',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    deleteProduct
);

router.get(
    '/admin/reviews',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    getReviews
);

router.delete(
    '/admin/review',
    isAuthenticatedUser,
    authorizeRoles('admin'),
    deleteReview
);

module.exports = router;
