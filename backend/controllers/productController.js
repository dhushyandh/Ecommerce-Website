const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// query to get all products -- api/v1/products
exports.getProducts = async (req, res, next) => {


    const resPerPage = 4;
    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter();
    }

    const filteredProductsCount = await buildQuery().query.countDocuments();
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    const products = await buildQuery().paginate(resPerPage).query;


    await new Promise(resolve => setTimeout(resolve, 100));
    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products
    })

}


// query to create new product -- api/v1/products/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    let images = [];
    let BASE_URL = process.env.BACKEND_URL;

    if (process.env.NODE_ENV === 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/product/${file.filename}`;
            images.push({ image: url });
        })
    }
    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })

});

// query to get single product -- api/v1/products/:id

exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');

        if (!product) {
            return next(new ErrorHandler("Product Not Found ", 400));
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};


// query to Update product -- api/v1/products/:id

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        // Uploading Images
        let images = [];

        // If images are not cleared, We keep existing images
        if (req.body.imagesCleared === 'false') {
            images = product.images;
        }
        let BASE_URL = process.env.BACKEND_URL;

        if (process.env.NODE_ENV === 'production') {
            BASE_URL = `${req.protocol}://${req.get('host')}`
        }

        if (req.files.length > 0) {
            req.files.forEach(file => {
                let url = `${BASE_URL}/uploads/product/${file.filename}`;
                images.push({ image: url });
            })
        }

        req.body.images = images;

        if (!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// query to delete a product -- api/v1/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product Deleted !"
        });
    } catch (error) {
        next(error);
    }
};

// Create Review -- {{base_url}}/api/v1/review

exports.createReview = catchAsyncError(async (req, res, next) => {
    const rawRating = req.body.rating ?? req.body.ratings;
    const { comment, productId } = req.body;


    const review = {
        user: req.user.id,
        rating: Number(rawRating),
        comment
    }
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(review =>
        review.user && review.user.toString() === req.user.id.toString()
    );

    // finding if user has already reviewed the product
    if (isReviewed) {
        // update the review
        product.reviews.forEach(review => {
            if (review.user && review.user.toString() === req.user.id.toString()) {
                review.rating = Number(rawRating)
                review.comment = comment;
            }
        })
    }
    else {
        // create new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // find average ratings
    const totalRating = product.reviews.reduce((acc, item) => {
        const val = Number(item.rating ?? item.ratings);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
    product.ratings = product.reviews.length ? totalRating / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

// Get all reviews of a product -- {{base_url}}/api/v1/reviews?productId=xxxx

exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews

    })
})

// Delete review -- {{base_url}}/api/v1/reviews?id=xxxx&productId=yyyy

exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });

    const numOfReviews = reviews.length;
    let ratings = 0;
    if (numOfReviews > 0) {
        const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
        ratings = isNaN(totalRating) ? 0 : totalRating;
        ratings = totalRating / numOfReviews;
    }
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    })

});

// Get Admin Products -- api/v1/admin/products

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})