const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler')
const productModel = require('../models/productModel');

// Create a new order -- {{base_url}}/api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(200).json({
        success: true,
        order
    })
})

// Get single order -- {{base_url}}/api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler(`Order not found with this Id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order
    })

})

// Get logged in user orders -- {{base_url}}/api/v1/myorders

exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    })
})

// ADMIN : get all orders -- {{base_url}}/api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//ADMIN: Update Order / Order Status -- {{base_url}}/api/v1/order/:id

exports.updateOrder = catchAsyncError(async (req, res, next) => {

    const orderId = req.params.id.trim();

    if (orderId.length !== 24) {
        return next(new ErrorHandler('Invalid Order ID format', 400));
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }


    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered', 400));
    }

    // Update stock 
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity);
    })
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })


})


async function updateStock(productId, quantity) {

    const product = await productModel.findById(productId);
    product.stock = product.stock - quantity;
    product.save({ validateBeforeSave: false });
}

// ADMIN: Delete Order -- {{base_url}}/api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order not found',404));
    }
    await order.deleteOne();

    res.status(200).json({
        success:true,
    })
})