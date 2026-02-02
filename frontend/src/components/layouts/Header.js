
import Search from "./Search"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Dropdown, Image } from "react-bootstrap"
import { logout } from "../../actions/userActions"

export default function Header() {


  const { isAuthenticated, user = {} } =
    useSelector(state => state.authState || {});
  const { items: cartItems } = useSelector(state => state.cartState || {})

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  }


  return (
    <nav className="navbar row ui-nav desktop-header">
      <div className="col-12 col-md-2">
        <div className="navbar-brand ui-brand">
          <Link to="/">
            <img alt="VIPStore logo" src="/images/vipstore-logo.svg" className="ui-logo" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-7 col-lg-4 mt-2 mt-md-0 ui-search-area">
        <Search />
      </div>

      <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0 text-center ui-user-area">
        {isAuthenticated ?
          (
            <Dropdown className="d-inline">
              <Dropdown.Toggle variant="default text-white pr-5" id='dropdown-basic'>
                <figure className="avatar avatar-nav">
                  <Image className="rounded-circle" width={"50px"} src={user?.avatar || "/images/default_avatar.png"}
                    alt={user?.name} />
                </figure>
                <span>{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <div className="dropdown-header user-menu-header">
                  <Image className="rounded-circle" width={48} src={user?.avatar || "/images/default_avatar.png"} alt={user?.name} />
                  <div className="user-menu-info">
                    <div className="user-menu-name">{user.name}</div>
                    <div className="user-menu-email muted">{user.email}</div>
                  </div>
                </div>
                <Dropdown.Divider />
                {user.role === 'admin' && <Dropdown.Item onClick={() => { navigate('/admin/dashboard') }} className="text-dark ">DashBoard</Dropdown.Item>}
                <Dropdown.Item onClick={() => { navigate('/myprofile') }} className="text-dark ">Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => { navigate('/orders') }} className="text-dark ">My Orders</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logoutHandler} className="text-danger ">LogOut</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) :
          <Link to="/login" className="btn ui-btn" id="login_btn">Login</Link>
        }

        <Link to="/cart" id="cart" className="ml-3 ui-link">Cart</Link>
        <span className="ml-1 ui-badge" id="cart_count">{cartItems.length}</span>
      </div>
    </nav>
  )
}