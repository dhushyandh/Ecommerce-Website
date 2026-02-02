import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions/userActions";
import { clearError, clearPasswordReset } from "../../slices/authSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";

export default function ResetPassword() {


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const dispatch = useDispatch();
    const { isPasswordReset, error } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        dispatch(clearPasswordReset());
        dispatch(clearError());
    }, [dispatch]);
    
    const submitHandler = (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast('Please enter password and confirm password', {
                type: 'error',
                position: 'bottom-right',
                theme: 'light',
            });
            return;
        }
        if (password !== confirmPassword) {
            toast('Passwords do not match', {
                type: 'error',
                position: 'bottom-right',
                theme: 'light',
            });
            return;
        }

        setHasSubmitted(true);

        dispatch(resetPassword(token, {
            password,
            confirmPassword
        }));

    }

    useEffect(() => {
        if (hasSubmitted && isPasswordReset) {
            toast('Password Reset Successfully !', {
                type: 'success',
                position: 'bottom-right',
                theme: 'light',
            })
            dispatch(clearPasswordReset());
            navigate('/')
            return;
        }
        if (error) {
            toast(error, {
                position: "bottom-right",
                type: 'error',
                theme: 'light',
                onOpen: () => { dispatch(clearError()) }
            })
            setHasSubmitted(false);
            return;
        }
    }, [hasSubmitted, isPasswordReset, error, navigate, dispatch])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">New Password</h1>

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

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>

                </form>
            </div>
        </div>
    )
}