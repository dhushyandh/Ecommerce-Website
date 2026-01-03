import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layouts/Loader";

export default function ProtectedRoute({ children, isAdmin = false }) {
    const { isAuthenticated, isAuthChecked, user } = useSelector(
        state => state.authState
    );
    if (isAdmin && user?.role !== "admin") {
        return <Navigate to="/login" replace />;
    }
    if (!isAuthChecked) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
