import { useSelector } from 'react-redux';
import Loader from '../layouts/Loader';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { user = {}, loading } =
    useSelector(state => state.authState || {});

  if (loading) return <Loader />;

  return (
    <>
      {/* ================= DESKTOP PROFILE (UNCHANGED) ================= */}
      <div className="desktop-profile row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3 text-center">
          <figure className='avatar avatar-profile mx-auto'>
            <img
              className="rounded-circle img-fluid"
              src={user?.avatar || "/images/default_avatar.png"}
              alt={user?.name}
            />
          </figure>

          <Link
            to="/myprofile/update"
            id="edit_profile"
            className="btn btn-primary btn-block my-5"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-12 col-md-5">
          <h4>Full Name</h4>
          <p>{user.name}</p>

          <h4>Email Address</h4>
          <p>{user.email}</p>

          <h4>Joined At</h4>
          <p>{String(user.createdAt).substring(0, 10)}</p>

          <Link to="/orders" className="btn btn-danger btn-block mt-5">
            My Orders
          </Link>

          <Link
            to="/myprofile/update/password"
            className="btn btn-primary btn-block mt-3"
          >
            Change Password
          </Link>
        </div>
      </div>

      {/* ================= MOBILE PROFILE (NO SCROLL) ================= */}
      <div className="mobile-profile">
        <div className="profile-card">
          <img
            src={user?.avatar || "/images/default_avatar.png"}
            alt={user?.name}
            className="profile-avatar"
          />

          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-email">{user.email}</p>
          <p className="profile-date">
            Joined on {String(user.createdAt).substring(0, 10)}
          </p>

          <div className="profile-actions">
            <Link to="/myprofile/update" className="btn btn-primary btn-block">
              Edit Profile
            </Link>

            <Link to="/orders" className="btn btn-outline-dark btn-block">
              My Orders
            </Link>

            <Link
              to="/myprofile/update/password"
              className="btn btn-danger btn-block"
            >
              Change Password
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="btn btn-dark"
              >
                Admin Dashboard
              </Link>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
