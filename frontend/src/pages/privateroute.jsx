// PrivateRoute.js
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = ({ allowedRoles }) => {
    const { usuario } = useUser();
    const location = useLocation();

    // Verifica si el usuario está autenticado y tiene un rol permitido
    if (!usuario) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
