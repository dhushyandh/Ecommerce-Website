import { useElements, useStripe } from "@stripe/react-stripe-js"
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./Shipping";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import axios from 'axios';
import { createOrder } from "../../actions/orderActions";
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderInfoRaw = sessionStorage.getItem('orderInfo');
    const orderInfo = orderInfoRaw ? JSON.parse(orderInfoRaw) : null;
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const { error: orderError } = useSelector(state => state.orderState);


    const paymentData = orderInfo ? {
        amount: Math.round(orderInfo.totalPrice * 100),
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    } : { amount: 0, shipping: {} };
    const order = {
        orderItems: cartItems,
        shippingInfo
    }
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.taxPrice = orderInfo.taxPrice;
        order.totalPrice = orderInfo.totalPrice;
    }
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
        if (!stripe || !elements) return;
        const payBtn = document.querySelector('#pay_btn');
        if (payBtn) payBtn.disabled = true;

        try {
            const { data } = await axios.post('/api/v1/payment/process', paymentData);
            const clientSecret = data?.client_secret;
            if (!clientSecret) {
                toast.error('Payment initialization failed', { position: 'bottom-right' });
                if (payBtn) payBtn.disabled = false;
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user?.name,
                        email: user?.email
                    }
                }
            });

            if (result.error) {
                toast.error(result.error.message || 'Payment failed', { position: 'bottom-right' });
                if (payBtn) payBtn.disabled = false;
                return;
            }

            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                toast.success('Payment Success 🎉', { position: "bottom-right" });

                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                }

                dispatch(orderCompleted());
                dispatch(createOrder(order));
                navigate('/order/success');
                return;
            }

            toast.warn('Payment could not be completed, please try again', { position: 'bottom-right' });
            if (payBtn) payBtn.disabled = false;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Payment error', { position: 'bottom-right' });
            const payBtn = document.querySelector('#pay_btn');
            if (payBtn) payBtn.disabled = false;
        }
    }

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>
                    <div className="form-group">
                        <label htmlFor="card_num_field">Card Number</label>
                        <CardNumberElement
                            type="text"
                            id="card_num_field"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="card_exp_field">Card Expiry</label>
                        <CardExpiryElement
                            type="text"
                            id="card_exp_field"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="card_cvc_field">Card CVC</label>
                        <CardCvcElement
                            type="text"
                            id="card_cvc_field"
                            className="form-control"
                        />
                    </div>


                    <button
                        id="pay_btn"
                        type="submit"
                        className="btn btn-block py-3"
                    >
                        Pay - ₹{`${orderInfo && orderInfo.totalPrice}`}
                    </button>

                </form>
            </div>
        </div>
    )
}