import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from "../../slices/cartSlice";

export default function Cart() {

    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cartState);
    const navigate = useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if (item.stock === 0 || count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product))
    }
    const decreaseQty = (item) => {
        const count = item.quantity;
        if (count === 1) return;
        dispatch(decreaseCartItemQty(item.product))
    }

    const checkOutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

    return (
        <Fragment>
            {items.length === 0 ?
                <h2 className="mt-5">Your Cart is Empty !</h2> :
                <Fragment>
                    <h2 className="mt-5">Your Cart: <b>{items.length}</b></h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            <div className="cart-list">
                                {items.map(item => (
                                    <Fragment key={item.product}>
                                        <hr />
                                        <div className="cart-card">
                                            <div className="row w-100 align-items-center gx-3">
                                                <div className="col-4 col-lg-3 p-0">
                                                    <img src={item.image} alt={item.name} className="cart-thumb" />
                                                </div>

                                                <div className="col-5 col-lg-3">
                                                    <Link className="cart-name" to={`/product/${item.product}`}>{item.name}</Link>
                                                </div>

                                                <div className="col-4 col-lg-2 d-none d-lg-block">
                                                    <p className="cart-price">₹{item.price}</p>
                                                </div>

                                                <div className="col-12 col-lg-3 mt-3 mt-lg-0">
                                                    <div className="quantity-controls d-inline-flex align-items-center">
                                                        <button className="qty-btn btn btn-light minus" onClick={() => decreaseQty(item)}>-</button>
                                                        <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />
                                                        <button className="qty-btn btn btn-light plus" onClick={() => increaseQty(item)}>+</button>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-lg-1 mt-3 mt-lg-0 text-lg-end">
                                                    <button aria-label="remove" onClick={() => dispatch(removeItemFromCart(item.product))} className="btn btn-outline-danger btn-icon"><i className="fa fa-trash"/></button>
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary" className="summary-card">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{items.reduce((acc, item) => (acc + item.quantity), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">₹{items.reduce((acc, item) => (acc + item.quantity * item.price), 0)}</span></p>

                                <hr />
                                <button id="checkout_btn" onClick={checkOutHandler} className="btn btn-primary btn-block">Proceed to Checkout</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            }

        </Fragment>
    )
}