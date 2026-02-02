import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";

export default function StripeCheckoutSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);

    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderCreated, setOrderCreated] = useState(false);
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        const run = async () => {
            const params = new URLSearchParams(location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                toast.error('Missing Stripe session id.', { position: 'bottom-right' });
                navigate('/payment');
                return;
            }

            try {
                const { data } = await axios.get(`/api/v1/payment/checkout-session/${sessionId}`);
                const paymentStatus = data?.session?.payment_status;

                if (paymentStatus !== 'paid') {
                    toast.error('Payment not completed. Please try again.', { position: 'bottom-right' });
                    navigate('/payment');
                    return;
                }

                setIsPaid(true);

                const createdKey = `stripeCheckoutOrderCreated_${sessionId}`;
                const alreadyCreatedForThisSession = sessionStorage.getItem(createdKey) === '1';
                if (alreadyCreatedForThisSession) {
                    setOrderCreated(true);
                    return;
                }

                const orderInfoRaw = sessionStorage.getItem('orderInfo');
                const orderInfo = orderInfoRaw ? JSON.parse(orderInfoRaw) : null;

                // If the user refreshes, cart/orderInfo may be gone; still show success UI.
                if (!orderInfo || !cartItems || cartItems.length === 0) {
                    setOrderCreated(false);
                    return;
                }

                const order = {
                    orderItems: cartItems,
                    shippingInfo,
                    itemsPrice: orderInfo.itemsPrice,
                    shippingPrice: orderInfo.shippingPrice,
                    taxPrice: orderInfo.taxPrice,
                    totalPrice: orderInfo.totalPrice,
                    paymentInfo: {
                        id: data?.session?.payment_intent?.id || sessionId,
                        status: paymentStatus,
                    }
                };

                const createRes = await axios.post('/api/v1/order/new', order);
                const createdOrderId = createRes?.data?.order?._id || null;
                if (createdOrderId) setOrderId(createdOrderId);

                sessionStorage.setItem(createdKey, '1');
                setOrderCreated(true);

                dispatch(orderCompleted());

                toast.success('Payment Success 🎉', { position: 'bottom-right' });
            } catch (error) {
                toast.error(error?.response?.data?.message || error.message || 'Unable to verify payment', { position: 'bottom-right' });
                navigate('/payment');
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [dispatch, navigate, location.search, cartItems, shippingInfo]);


    return (
        <div className="row justify-content-center">
            <div className="col-10 col-lg-6 mt-5 text-center">
                {loading ? (
                    <>
                        <h2>Finalizing your payment…</h2>
                        <p>Please wait.</p>
                    </>
                ) : isPaid ? (
                    <>
                        <div
                            className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle"
                            style={{ width: 88, height: 88, fontSize: 44, fontWeight: 700 }}
                            aria-label="Payment successful"
                        >
                            ✓
                        </div>

                        <h2 className="mt-4">Payment Successful</h2>

                        {orderCreated ? (
                            <p className="mt-2">Your order is placed successfully.</p>
                        ) : (
                            <p className="mt-2">Payment received. If your order isn't visible yet, check My Orders.</p>
                        )}

                        <div className="mt-4">
                            <Link to="/orders">Go to My Orders</Link>
                        </div>

                        {orderId ? (
                            <div className="mt-2">
                                <Link to={`/order/${orderId}`}>View this Order</Link>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <>
                        <h2>Payment status unknown</h2>
                        <p>Please go back to payment and try again.</p>
                        <Link to="/payment">Back to Payment</Link>
                    </>
                )}
            </div>
        </div>
    );
}
