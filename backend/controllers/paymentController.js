const catchAsyncError = require('../middlewares/catchAsyncError');
let stripe = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey) {
    try {
        stripe = require('stripe')(stripeKey);
    } catch (err) {
        stripe = null;
    }
}

exports.processPayment = catchAsyncError(async (req, res, next) => {
    if (!stripe) {
        const err = new Error('Stripe secret key not configured. Set STRIPE_SECRET_KEY in environment.');
        err.statusCode = 500;
        throw err;
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:"usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: 'accept_payment' },
        shipping: req.body.shipping
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})
 
exports.validateStripeKey = catchAsyncError(async (req, res, next) => {

    try {
        const balance = await stripe.balance.retrieve();
        res.status(200).json({
            success: true,
            message: 'Stripe key valid (test/live).',
            livemode: balance?.livemode ?? false
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        err.message = err.message || 'Stripe key validation failed';
        throw err;
    }
});