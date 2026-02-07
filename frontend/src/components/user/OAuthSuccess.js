import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function OAuthSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(loadUser());
        toast.success('Login successful', { position: 'bottom-right' });
        navigate("/");
    }, [dispatch, navigate]);

    return <h3>Signing you in...</h3>;
}
