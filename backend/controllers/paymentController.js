const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncError(async (req, res, next) => {
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
    // Use a non-destructive Stripe call to verify the secret key is valid.
    // balance.retrieve() requires valid credentials but does not create charges.
    try {
        const balance = await stripe.balance.retrieve();
        res.status(200).json({
            success: true,
            message: 'Stripe key valid (test/live).',
            livemode: balance?.livemode ?? false
        });
    } catch (err) {
        // Bubble up a clear error message (middleware will redact keys if any appear)
        err.statusCode = err.statusCode || 400;
        err.message = err.message || 'Stripe key validation failed';
        throw err;
    }
});