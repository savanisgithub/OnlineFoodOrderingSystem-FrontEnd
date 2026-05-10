import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
