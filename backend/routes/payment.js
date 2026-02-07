const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { processPayment, sendStripeApi, createCheckoutSession, getCheckoutSession, createRazorpayOrder } = require('../controllers/paymentController');

router.route('/payment/process').post(isAuthenticatedUser,processPayment);
router.route('/payment/checkout-session').post(isAuthenticatedUser, createCheckoutSession);
router.route('/payment/checkout-session/:id').get(isAuthenticatedUser, getCheckoutSession);
router.route('/stripeapi').get(isAuthenticatedUser,sendStripeApi);

router.route('/payment/razorpay-order').post(isAuthenticatedUser, createRazorpayOrder);

module.exports = router;