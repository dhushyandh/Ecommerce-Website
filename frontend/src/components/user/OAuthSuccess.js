import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(loadUser());
        navigate("/");
    }, [dispatch, navigate]);

    return <h3>Signing you in...</h3>;
}
