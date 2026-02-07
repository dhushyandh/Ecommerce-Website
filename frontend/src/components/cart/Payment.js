import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./Shipping";
import { toast } from "react-toastify";
import axios from 'axios';
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderInfoRaw = sessionStorage.getItem('orderInfo');
    const orderInfo = orderInfoRaw ? JSON.parse(orderInfoRaw) : null;
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const { error: orderError } = useSelector(state => state.orderState);

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [method, setMethod] = useState('cod');

    const loadRazorpayScript = () => new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
        document.body.appendChild(script);
    });


    useEffect(() => {
        if (shippingInfo && Object.keys(shippingInfo).length > 0) {
            validateShipping(shippingInfo, navigate);
        }

        if (orderError) {
            toast(orderError, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearOrderError()) }
            })
            return;
        }
    }, [navigate]);


    const submitHandler = async (e) => {
        e.preventDefault();
        if (!orderInfo) {
            toast.error('Order info missing. Please confirm your order again.', { position: 'bottom-right' });
            navigate('/order/confirm');
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            toast.error('Your cart is empty.', { position: 'bottom-right' });
            navigate('/cart');
            return;
        }

        try {
            setIsRedirecting(true);
            const { data } = await axios.post('/api/v1/payment/checkout-session', {
                cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
                shippingInfo,
                user: { name: user?.name, email: user?.email }
            });

            if (!data?.url) {
                toast.error('Unable to start Stripe Checkout. Please try again.', { position: 'bottom-right' });
                setIsRedirecting(false);
                return;
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Payment error', { position: 'bottom-right' });
            setIsRedirecting(false);
        }
    }

    const razorpayHandler = async (e) => {
        e.preventDefault();
        if (!orderInfo) {
            toast.error('Order info missing. Please confirm your order again.', { position: 'bottom-right' });
            navigate('/order/confirm');
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            toast.error('Your cart is empty.', { position: 'bottom-right' });
            navigate('/cart');
            return;
        }

        try {
            setIsRedirecting(true);

            await loadRazorpayScript();

            const { data } = await axios.post('/api/v1/payment/razorpay-order', {
                cartItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
                shippingInfo
            });

            if (!data?.id) {
                throw new Error(data?.message || 'Failed to create Razorpay order');
            }

            const options = {
                key: data.razorpayKey,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: 'VIPStore',
                description: 'Order Payment',
                order_id: data.id,
                handler: async function (response) {
                    try {
                        const paymentInfo = {
                            id: response.razorpay_payment_id,
                            status: 'paid',
                            method: 'razorpay'
                        };

                        const payload = {
                            orderItems: cartItems,
                            shippingInfo,
                            itemsPrice: orderInfo.itemsPrice || orderInfo.subtotal || 0,
                            taxPrice: orderInfo.taxPrice || orderInfo.tax || 0,
                            shippingPrice: orderInfo.shippingPrice || orderInfo.shippingCharges || 0,
                            totalPrice: orderInfo.totalPrice || 0,
                            paymentInfo
                        };

                        await axios.post('/api/v1/order/new', payload);

                        toast.success('Payment successful — order placed!', { position: 'bottom-right' });
                        navigate('/order/success');
                    } catch (err) {
                        toast.error(err?.response?.data?.message || err.message || 'Order creation failed', { position: 'bottom-right' });
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || ''
                },
                theme: { color: '#F37254' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsRedirecting(false);

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Razorpay error', { position: 'bottom-right' });
            setIsRedirecting(false);
        }
    }

    const displayTotal = orderInfo?.totalPrice ?? orderInfo?.total ?? cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-8">
                <div className="shadow-lg p-4 payment-card">
                    <h2 className="mb-3">Choose Payment Method</h2>

                    <div className="d-flex flex-column gap-3">
                        <button
                            type="button"
                            onClick={() => setMethod('razorpay')}
                            className={`method-btn ${method === 'razorpay' ? 'selected' : ''}`}
                        >
                            <div className="method-left">
                                <div className="method-icon">
                                    <img src="/images/razorpay_logo.png" alt="Razorpay" />
                                </div>
                                <div className="method-text">
                                    <div className="method-title">Razorpay</div>
                                    <div className="method-sub">UPI • Cards • Netbanking</div>
                                </div>
                            </div>
                            {method === 'razorpay' && <span className="method-badge">Selected</span>}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod('stripe')}
                            className={`method-btn ${method === 'stripe' ? 'selected' : ''}`}
                        >
                            <div className="method-left">
                                <div className="method-icon">
                                    <img src="/images/stripe_logo.png" alt="Stripe" />
                                </div>
                                <div className="method-text">
                                    <div className="method-title">Stripe Checkout</div>
                                    <div className="method-sub">Cards • Wallets • Apple/Google Pay</div>
                                </div>
                            </div>
                            {method === 'stripe' && <span className="method-badge">Selected</span>}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod('cod')}
                            className={`method-btn ${method === 'cod' ? 'selected' : ''}`}
                        >
                            <div className="method-left">
                                <div className="method-icon">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="#6c757d" />
                                        <path d="M2 7h13v6h4l3 4v1H2V7z" fill="#fff" />
                                    </svg>
                                </div>
                                <div className="method-text">
                                    <div className="method-title">Cash on Delivery</div>
                                    <div className="method-sub">Pay when delivery is received</div>
                                </div>
                            </div>
                            {method === 'cod' && <span className="method-badge">Selected</span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-10 col-lg-4">
                <div className="shadow-lg p-4 summary-card">
                    <h4 className="mb-3">Order Summary</h4>
                    <div className="d-flex justify-content-between mb-2"><span>Items</span><strong>{cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0)} Units</strong></div>
                    <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><strong>₹{orderInfo?.itemsPrice ?? orderInfo?.subtotal ?? cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0)}</strong></div>
                    <div className="d-flex justify-content-between mb-2"><span>Shipping</span><strong>₹{orderInfo?.shippingPrice ?? orderInfo?.shippingCharges ?? (displayTotal > 20000 ? 0 : 25)}</strong></div>
                    <div className="d-flex justify-content-between mb-3"><span>Tax</span><strong>₹{orderInfo?.taxPrice ?? Math.round((orderInfo?.itemsPrice ?? displayTotal) * 0.05)}</strong></div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3"><span className="h5">Total</span><span className="h5">₹{displayTotal}</span></div>

                    <div className="d-grid gap-2">
                        {method === 'stripe' && (
                            <button onClick={submitHandler} className="btn btn-primary py-2" disabled={isRedirecting}>
                                {isRedirecting ? 'Redirecting…' : `Pay with Stripe — ₹${displayTotal}`}
                            </button>
                        )}

                        {method === 'razorpay' && (
                            <button onClick={razorpayHandler} className="btn btn-outline-primary py-2" disabled={isRedirecting}>
                                {isRedirecting ? 'Processing…' : `Pay with Razorpay — ₹${displayTotal}`}
                            </button>
                        )}

                        {method === 'cod' && (
                            <button onClick={async () => {
                                toast.info('Cash on Delivery selected. Place order to confirm.', { position: 'bottom-right' });
                                try {
                                    const itemsPrice = orderInfo?.itemsPrice ?? orderInfo?.subtotal ?? displayTotal;
                                    const taxPrice = orderInfo?.taxPrice ?? Math.round((orderInfo?.itemsPrice ?? itemsPrice) * 0.05);
                                    const shippingPrice = orderInfo?.shippingPrice ?? orderInfo?.shippingCharges ?? (displayTotal > 20000 ? 0 : 25);

                                    const payload = {
                                        orderItems: cartItems,
                                        shippingInfo,
                                        itemsPrice,
                                        taxPrice,
                                        shippingPrice,
                                        totalPrice: displayTotal,
                                        paymentInfo: { id: `COD_${Date.now()}`, method: 'cod', status: 'pending' }
                                    };
                                    await axios.post('/api/v1/order/new', payload);
                                    toast.success('Order placed (COD).', { position: 'bottom-right' });
                                    navigate('/order/success');
                                } catch (err) {
                                    toast.error(err?.response?.data?.message || err.message || 'Order failed', { position: 'bottom-right' });
                                }
                            }} className="btn btn-secondary py-2" disabled={isRedirecting}>
                                Place Order — Cash on Delivery
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
