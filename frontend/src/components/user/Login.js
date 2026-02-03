import { Fragment } from "react/jsx-runtime";
import MetaData from '../layouts/MetaData'
import { useEffect, useState } from "react";
import { clearAuthError, login } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../icons/GoogleIcon";


export default function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [didSubmit, setDidSubmit] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    const redirect = redirectParam ? decodeURIComponent(redirectParam) : '/';

    const submitHandler = (e) => {
        e.preventDefault();
        setDidSubmit(true);
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (error) {
            setDidSubmit(false);
            toast(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError()) }
            })
            return;
        }

        if (didSubmit && !loading && isAuthenticated) {
            toast.success('Login successful', {
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'light',
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
            });
            setDidSubmit(false);
            navigate(redirect);
        }
    }, [error, isAuthenticated, loading, navigate, dispatch, didSubmit, redirect])
    const googleLogin = () => {
        const base =
            process.env.REACT_APP_BACKEND_URL ||
            (window.location.hostname === "localhost"
                ? "http://localhost:8000"
                : window.location.origin);

        const redirect = encodeURIComponent(window.location.origin);
        window.location.href = `${base}/api/auth/google?redirect=${redirect}`;
    };




    return (
        <Fragment>
            <MetaData title={`Login`} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mr-3 mb-4">
                            <Link to="/password/forget">Forgot Password?</Link>
                            <Link to={'/register'}>New User?</Link>
                        </div>

                        <button
                            id="login_button"
                            type="submit"
                            className="btn btn-block py-3 justify-content-center"
                            disabled={loading}
                        >
                            LOGIN
                        </button>
                        <hr />

                        <button
                            type="button"
                            onClick={googleLogin}
                            className="btn btn-light btn-block py-3 mt-3 d-flex align-items-center justify-content-center gap-2"
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: "#fff",
                                color: "#000",
                                fontWeight: "500",
                            }}
                        >
                            <GoogleIcon size={20} />
                            <span>Login with Google</span>
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}