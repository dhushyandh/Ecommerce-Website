import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../icons/GoogleIcon";

export default function Register() {


    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.authState)

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader;
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0]);

                }
            };

            reader.readAsDataURL(e.target.files[0])
        }
        else {
            setUserData({ ...userData, [e.target.name]: e.target.value })
        }
    };


    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar);

        dispatch(register(formData));
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
            return
        }

        if (error) {
            toast(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
            return;
        }

    }, [error, isAuthenticated, dispatch, navigate])

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
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                        <label htmlFor="email_field">Name</label>
                        <input name="name" onChange={onChange} type="name" id="name_field" className="form-control" value={userData.name} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={onChange}
                            id="email_field"
                            className="form-control"
                            value={userData.email}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={onChange}
                            id="password_field"
                            className="form-control"
                            value={userData.password}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Avatar'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    onChange={onChange}
                                    className='custom-file-input'
                                    id='customFile'
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="btn btn-block py-3 justify-content-center"
                        disabled={loading}
                    >
                        REGISTER
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
                        <span>Sign Up with Google</span>
                    </button>
                </form>
            </div>
        </div>
    )
}