import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, forgetPassword as forgetPasswordAction } from "../../actions/userActions";
import { clearForgotEmailSent } from "../../slices/authSlice";
import { toast } from "react-toastify";

export default function ForgetPassword() {

    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const { error, message, isForgotEmailSent } = useSelector(state => state.authState)

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(forgetPasswordAction({
            email
        }))
    }

    useEffect(() => {
        if (isForgotEmailSent) {
            toast(message || 'Reset password link sent. Please check your email.', {
                type: 'success',
                position: 'bottom-right',
                theme: 'light',
            })
            setEmail("");
            dispatch(clearForgotEmailSent());
            return;
        }
        if (error) {
            toast(error, {
                position: "bottom-right",
                type: 'error',
                theme: 'light',
                onOpen: () => { dispatch(clearAuthError()) }
            })
            return;
        }
    }, [isForgotEmailSent, message, error, dispatch])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                    </button>

                </form>
            </div>
        </div>
    )
}