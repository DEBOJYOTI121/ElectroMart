import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

    const adminToken = localStorage.getItem("admin-token");

    if (adminToken) {
        return <Navigate to="/" replace />;
    }

    return children;

};

export default PublicRoute;