const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

/* ===============================
   GET ALL PRODUCTS
================================ */
exports.getProducts = async (req, res, next) => {

    const resPerPage = 8;

    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query)
            .search()
            .filter();
    };

    const filteredProductsCount = await buildQuery().query.countDocuments();
    const totalProductsCount = await Product.countDocuments({});

    let productsCount = filteredProductsCount !== totalProductsCount
        ? filteredProductsCount
        : totalProductsCount;

    const products = await buildQuery()
        .paginate(resPerPage)
        .query;

    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products
    });
};

const cloudinary = require("../config/cloudinary");
exports.newProduct = catchAsyncError(async (req, res, next) => {

    if (!req.user) {
        return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Please upload images", 400));
    }

    const images = [];

    for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "products"
        });

        images.push({ image: result.secure_url });
        fs.unlinkSync(file.path);
    }

    const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        seller: req.body.seller,
        stock: req.body.stock,
        images,
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        product
    });
});




/* ===============================
   GET SINGLE PRODUCT
================================ */
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product
        .findById(req.params.id)
        .populate('reviews.user', 'name email');

    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

/* ===============================
   UPDATE PRODUCT (Cloudinary)
================================ */
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }

    // If new images uploaded → replace images
    if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => ({
            image: file.path
        }));
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        product
    });
});

/* ===============================
   DELETE PRODUCT
================================ */
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product Deleted Successfully'
    });
});

/* ===============================
   CREATE / UPDATE REVIEW
================================ */
exports.createReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user.id,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user.id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach(r => {
            if (r.user.toString() === req.user.id.toString()) {
                r.rating = Number(rating);
                r.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

/* ===============================
   GET REVIEWS
================================ */
exports.getReviews = catchAsyncError(async (req, res, next) => {

    const product = await Product
        .findById(req.query.id)
        .populate('reviews.user', 'name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

/* ===============================
   DELETE REVIEW
================================ */
exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
        r => r._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;
    const ratings =
        reviews.reduce((acc, item) => item.rating + acc, 0) / (numOfReviews || 1);

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    });

    res.status(200).json({
        success: true
    });
});

/* ===============================
   ADMIN PRODUCTS
================================ */
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
});