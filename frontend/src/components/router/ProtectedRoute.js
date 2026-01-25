import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../layouts/Loader";

export default function ProtectedRoute({ children, isAdmin = false }) {
    const location = useLocation();
    const { isAuthenticated, isAuthChecked, user } = useSelector(
        state => state.authState
    );

    const redirectToLogin = (extra = '') => {
        const next = encodeURIComponent(location.pathname + (location.search || ''));
        return `/login?redirect=${next}${extra}`;
    };

    if (!isAuthChecked) {
        return <Loader />;
    }

    if (isAdmin && user?.role !== "admin") {
        return <Navigate to={redirectToLogin()} replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectToLogin()} replace />;
    }

    return children;
}
