import { Fragment } from "react/jsx-runtime";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userOrders as userOrdersActions } from "../../actions/orderActions";
import { Link } from "react-router-dom";

export default function UserOrders() {

    const { userOrders = [] } = useSelector(state => state.orderState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userOrdersActions());

    }, [dispatch])

    // Render custom table rows (styled like admin orders table)
    const renderRows = () => {
        return userOrders.map(order => (
            <tr key={order._id} className="order-row">
                <td className="order-id"><Link to={`/order/${order._id}`}>{order._id}</Link></td>
                <td className="order-items">{order.orderItems.length}</td>
                <td className="order-amount">₹{order.totalPrice}</td>
                <td className="order-status">
                    {order.orderStatus && order.orderStatus.includes('Delivered') ? (
                        <p style={{ color: 'green', margin: 0, fontWeight: 700 }}>{order.orderStatus}</p>
                    ) : (
                        <p style={{ color: 'red', margin: 0, fontWeight: 700 }}>{order.orderStatus}</p>
                    )}
                </td>
                <td className="order-actions">
                    <Link to={`/order/${order._id}`} className="btn btn-primary btn-icon" aria-label={`View ${order._id}`} title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </Link>
                </td>
            </tr>
        ))
    }

    return (
        <Fragment>
            <MetaData title="My Orders" />
            <h1 className="mt-5">My Orders</h1>

            <div className="orders-table card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}