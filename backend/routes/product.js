const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(__dirname, '..', 'uploads', 'product');
            try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

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

module.exports = router;