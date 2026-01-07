import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

const IconDashboard = ({ className = '' }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3z"/><path d="M13 21h8v-8h-8z"/><path d="M13 3v8h8"/><path d="M3 21h8v-8H3z"/></svg>
)

const IconProduct = ({ className = '' }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 3"/><path d="M3 8v8a2 2 0 0 0 1 1.73L11 21"/><path d="M21 8l-9 5-9-5"/></svg>
)

const IconOrders = ({ className = '' }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
)

const IconUsers = ({ className = '' }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

export default function Sidebar() {

    const navigate = useNavigate();

    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li className="sidebar-item">
                        <Link to="/admin/dashboard"><IconDashboard /> <span>Dashboard</span></Link>
                    </li>

                    <li className="sidebar-item">
                        <NavDropdown title={<><IconProduct /> <span>Product</span></>}>
                            <NavDropdown.Item onClick={() => navigate('/admin/products')}><IconProduct /> All</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/admin/products/create')}><IconProduct /> Create</NavDropdown.Item>

                        </NavDropdown>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/admin/orders"><IconOrders /> <span>Orders</span></Link>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/admin/users"><IconUsers /> <span>Users</span></Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/admin/reviews"><IconUsers /> <span>Reviews</span></Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}