import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { isAuthenticated, token } = useAuth();

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};