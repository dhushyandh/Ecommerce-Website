import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BottomNav() {
  const location = useLocation();
  const { items = [] } = useSelector(state => state.cartState || {});
  const { isAuthenticated , user = {} } = useSelector(state => state.authState || {});

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        <span>🏠</span>
        <small>Home</small>
      </Link>

      <Link to="/search/">
        <span>🔍</span>
        <small>Search</small>
      </Link>

      <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
        <span>🛒</span>
        {items.length > 0 && <b className="cart-dot">{items.length}</b>}
        <small>Cart</small>
      </Link>

      <Link to={isAuthenticated ? "/myprofile" : "/login"}>
        <span>👤</span>
        <small>Profile</small>
      </Link>
      {user?.role === "admin" && (
  <Link to="/admin/dashboard">
    <span>🛠️</span>
    <small>Admin</small>
  </Link>
)}

    </nav>
  );
}
