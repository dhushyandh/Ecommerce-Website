import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersActions } from "../../actions/orderActions";
import { Link } from "react-router-dom";

export default function UserOrders() {
  const { userOrders = [] } = useSelector(state => state.orderState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userOrdersActions());
  }, [dispatch]);

  return (
    <Fragment>
      <MetaData title="My Orders" />
      <h1 className="mt-5 text-center">My Orders</h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="orders-table card desktop-orders">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/order/${order._id}`}>
                        {order._id}
                      </Link>
                    </td>
                    <td>{order.orderItems.length}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <span className={
                        order.orderStatus.includes("Delivered")
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/order/${order._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="mobile-orders ">
        {userOrders.map(order => (
          <div className="order-card" key={order._id}>
            <div className="order-row">
              <span className="label">Order ID</span>
              <Link to={`/order/${order._id}`} className="value link">
                {order._id.slice(0, 12)}...
              </Link>
            </div>

            <div className="order-row">
              <span className="label">Items</span>
              <span className="value">{order.orderItems.length}</span>
            </div>

            <div className="order-row">
              <span className="label">Amount</span>
              <span className="value price">₹{order.totalPrice}</span>
            </div>

            <div className="order-row">
              <span className="label">Status</span>
              <span className={
                order.orderStatus.includes("Delivered")
                  ? "status delivered"
                  : "status pending"
              }>
                {order.orderStatus}
              </span>
            </div>

            <Link
              to={`/order/${order._id}`}
              className="btn btn-block order-btn justify-content-center text-white"
            >
              View Order
            </Link>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
