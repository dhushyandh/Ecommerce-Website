import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layouts/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { logout, updateProfile } from '../../actions/userActions';
import { clearError, clearUpdateProfile } from '../../slices/authSlice';
import { toast } from 'react-toastify';

export default function Profile() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const { user = {}, loading, isUpdated, error } =
    useSelector(state => state.authState || {});
  const { isAuthenticated } = useSelector(state => state.authState || {});

  useEffect(() => {
    if (isUpdated) {
      toast('Profile photo updated', { type: 'success', position: 'bottom-right', theme: 'light' });
      dispatch(clearUpdateProfile());
    }
    if (error) {
      toast(error, { type: 'error', position: 'bottom-right', theme: 'light' });
      dispatch(clearError());
    }
  }, [isUpdated, error, dispatch]);

  if (loading) return <Loader />;

  const logoutHandler = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const editAvatar = () => {
    setShowAvatarMenu(false);
    fileInputRef.current?.click();
  };

  const onAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    dispatch(updateProfile(formData));


    e.target.value = '';
  };

  const deleteAvatar = () => {
    setShowAvatarMenu(false);
    dispatch(updateProfile({ removeAvatar: true }));
  };

  const avatarSrc = user?.avatar || "/images/default_avatar.png";

  return (
    <>
      <div className="desktop-profile row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-3 text-center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <figure className='avatar avatar-profile mx-auto' style={{ cursor: 'pointer' }}>
              <img
                className="rounded-circle img-fluid"
                src={avatarSrc}
                alt={user?.name}
                onClick={() => setShowAvatarMenu(v => !v)}
              />
            </figure>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onAvatarFileChange}
              style={{ display: 'none' }}
            />

            {showAvatarMenu && (
              <div
                className="shadow"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  borderRadius: 8,
                  padding: 8,
                  minWidth: 180,
                  zIndex: 10,
                  border: '1px solid #e5e5e5',
                }}
              >
                <button type="button" className="btn btn-light btn-block" onClick={editAvatar}>
                  Edit profile image
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-block mt-2"
                  onClick={deleteAvatar}
                  disabled={!user?.avatar}
                >
                  Delete profile image
                </button>
              </div>
            )}
          </div>

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
          <div style={{ position: 'relative' }}>
            <img
              src={avatarSrc}
              alt={user?.name}
              className="profile-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowAvatarMenu(v => !v)}
            />

            {showAvatarMenu && (
              <div
                className="shadow"
                style={{
                  position: 'absolute',
                  top: '105%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  borderRadius: 8,
                  padding: 8,
                  minWidth: 220,
                  zIndex: 10,
                  border: '1px solid #e5e5e5',
                }}
              >
                <button type="button" className="btn btn-light btn-block" onClick={editAvatar}>
                  Edit profile image
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-block mt-2"
                  onClick={deleteAvatar}
                  disabled={!user?.avatar}
                >
                  Delete profile image
                </button>
              </div>
            )}
          </div>

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
              <>
                <Link
                  to="/admin/dashboard"
                  className="btn btn-dark"
                >
                  Admin Dashboard
                </Link>
                {isAuthenticated && (
                  <button type="button" className="btn btn-danger btn-block" onClick={logoutHandler}>
                    Logout
                  </button>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
