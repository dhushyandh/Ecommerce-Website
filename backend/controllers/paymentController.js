const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
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
        currency: "inr",
        description: "VIPStore Payment",
        metadata: { integration_check: 'accept_payment' },
        shipping: req.body.shipping
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})

function getFrontendBaseUrl(req) {
    const configured = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null;
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').toString().split(',')[0].trim();
    const host = req.get('host');
    const fallback = host ? `${proto}://${host}` : null;
    return configured || fallback;
}

function toPaise(amountRupees) {
    return Math.round(Number(amountRupees) * 100);
}


exports.createCheckoutSession = catchAsyncError(async (req, res, next) => {
    if (!stripe) {
        return next(new ErrorHandler('Stripe secret key not configured. Set STRIPE_SECRET_KEY in environment.', 500));
    }

    const { cartItems } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return next(new ErrorHandler('Cart is empty', 400));
    }

    const frontendBaseUrl = getFrontendBaseUrl(req);
    if (!frontendBaseUrl) {
        return next(new ErrorHandler('Unable to determine frontend URL. Set FRONTEND_URL in environment.', 500));
    }

    const normalizedItems = cartItems.map((item) => ({
        product: (item?.product || '').toString().trim(),
        quantity: Number(item?.quantity || 0)
    }));

    for (const item of normalizedItems) {
        if (!item.product || item.product.length !== 24) {
            return next(new ErrorHandler('Invalid cart item product id', 400));
        }
        if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
            return next(new ErrorHandler('Invalid cart item quantity', 400));
        }
    }

    const productIds = normalizedItems.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } }).select('name price images stock');
    const productById = new Map(products.map((p) => [p._id.toString(), p]));

    let itemsTotalPaise = 0;
    const line_items = [];

    for (const item of normalizedItems) {
        const product = productById.get(item.product);
        if (!product) {
            return next(new ErrorHandler('One or more products in your cart no longer exist', 400));
        }
        if (typeof product.stock === 'number' && product.stock < item.quantity) {
            return next(new ErrorHandler(`Insufficient stock for ${product.name}`, 400));
        }

        const unitAmountPaise = toPaise(product.price);
        itemsTotalPaise += unitAmountPaise * item.quantity;

        const imageUrl = product?.images?.[0]?.image;
        const product_data = {
            name: product.name,
        };
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            product_data.images = [imageUrl];
        }

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data,
                unit_amount: unitAmountPaise,
            },
            quantity: item.quantity,
        });
    }

    const shippingPaise = itemsTotalPaise > 20000 ? 0 : 2500; 
    const taxPaise = Math.round(itemsTotalPaise * 0.05);

    if (shippingPaise > 0) {
        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: { name: 'Shipping' },
                unit_amount: shippingPaise,
            },
            quantity: 1,
        });
    }

    if (taxPaise > 0) {
        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: { name: 'Tax (5%)' },
                unit_amount: taxPaise,
            },
            quantity: 1,
        });
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: `${frontendBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendBaseUrl}/payment/cancel`,
        customer_email: req.user?.email,
        client_reference_id: req.user?.id,
        metadata: {
            itemsTotalPaise: String(itemsTotalPaise),
            shippingPaise: String(shippingPaise),
            taxPaise: String(taxPaise),
        }
    });

    res.status(200).json({
        success: true,
        url: session.url,
        sessionId: session.id,
    });
});

exports.getCheckoutSession = catchAsyncError(async (req, res, next) => {
    if (!stripe) {
        return next(new ErrorHandler('Stripe secret key not configured. Set STRIPE_SECRET_KEY in environment.', 500));
    }

    const sessionId = (req.params.id || '').toString().trim();
    if (!sessionId) {
        return next(new ErrorHandler('Session id is required', 400));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
    });

    res.status(200).json({
        success: true,
        session: {
            id: session.id,
            payment_status: session.payment_status,
            currency: session.currency,
            amount_total: session.amount_total,
            payment_intent: session.payment_intent
                ? { id: session.payment_intent.id, status: session.payment_intent.status }
                : null,
        }
    });
});

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