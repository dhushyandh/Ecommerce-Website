import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from "../../actions/productAction";
import { getUsers } from '../../actions/userActions';
import { adminOrders as adminOrdersAction } from '../../actions/orderActions';
import { Link } from "react-router-dom";

// Simple inline lucide-style icons (SVG)
const IconDollar = ({ className = '' }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H15a3.5 3.5 0 0 1 0 7H6"/></svg>
)

const IconBox = ({ className = '' }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 3"/><path d="M3 8v8a2 2 0 0 0 1 1.73L11 21"/><path d="M21 8l-9 5-9-5"/></svg>
)

const IconShoppingCart = ({ className = '' }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
)

const IconUsers = ({ className = '' }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

const IconAlert = ({ className = '' }) => (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
)

export default function Dashboard() {

    const { products = [] } = useSelector(state => state.productsState);
    const { adminOrders = [] } = useSelector(state => state.orderState);
    const { users = [] } = useSelector(state => state.userState);
    const dispatch = useDispatch();
    let outOfStock = 0;

    if (products.length > 0) {
        products.forEach(product => {
            if (product.stock === 0) {
                outOfStock = outOfStock + 1;
            }
        })
    }
    let totalAmount = 0;
    if (adminOrders.length > 0) {
        adminOrders.forEach(order => {
            totalAmount += order.totalPrice
        })
    }

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(adminOrdersAction());
        dispatch(getUsers());

    }, [])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Dashboard</h1>

                <div className="admin-stats mb-4">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon"><IconDollar /></div>
                        <div className="stat-body">
                            <div className="stat-title">Total Amount</div>
                            <div className="stat-value">₹{totalAmount}</div>
                        </div>
                    </div>
                </div>

                <div className="row gx-3">
                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="stat-card stat-green">
                            <div className="stat-icon"><IconBox /></div>
                            <div className="stat-body">
                                <div className="stat-title">Products</div>
                                <div className="stat-value">{products.length}</div>
                            </div>
                            <Link className="stat-link" to="/admin/products">View Details →</Link>
                        </div>
                    </div>

                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="stat-card stat-red">
                            <div className="stat-icon"><IconShoppingCart /></div>
                            <div className="stat-body">
                                <div className="stat-title">Orders</div>
                                <div className="stat-value">{adminOrders.length}</div>
                            </div>
                            <Link className="stat-link" to="/admin/orders">View Details →</Link>
                        </div>
                    </div>

                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="stat-card stat-blue">
                            <div className="stat-icon"><IconUsers /></div>
                            <div className="stat-body">
                                <div className="stat-title">Users</div>
                                <div className="stat-value">{users.length}</div>
                            </div>
                            <Link className="stat-link" to="/admin/users">View Details →</Link>
                        </div>
                    </div>

                    <div className="col-xl-3 col-sm-6 mb-3">
                        <div className="stat-card stat-yellow">
                            <div className="stat-icon"><IconAlert /></div>
                            <div className="stat-body">
                                <div className="stat-title">Out of Stock</div>
                                <div className="stat-value">{outOfStock}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}