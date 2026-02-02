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

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Payment</h1>
                    <p className="mb-4">You will be redirected to Stripe Checkout to complete payment securely.</p>

                    <button
                        id="pay_btn"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={isRedirecting}
                    >
                        {isRedirecting ? 'Redirecting…' : `Pay with Stripe - ₹${orderInfo && orderInfo.totalPrice}`}
                    </button>

                </form>
            </div>
        </div>
    )
}