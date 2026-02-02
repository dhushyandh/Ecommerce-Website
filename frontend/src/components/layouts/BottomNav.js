import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [] } = useSelector(state => state.cartState || {});
  const { isAuthenticated, user = {} } = useSelector(state => state.authState || {});

  const logoutHandler = async () => {
    await dispatch(logout());
    navigate('/login');
  };

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

      <Link to={isAuthenticated ? "/myprofile" : "/login"} className={location.pathname === "/myprofile" ? "active" : ""}>
        {isAuthenticated ? (
          <img
            className="mobile-nav-avatar"
            src={user?.avatar || "/images/default_avatar.png"}
            alt={user?.name || "Profile"}
          />
        ) : (
          <span>👤</span>
        )}
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
