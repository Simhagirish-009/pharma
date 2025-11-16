import React from "react";
import { Navigate } from "react-router-dom";

const Adminprivaterouting = ({ children }) => {
    const isAuthenticated = localStorage.getItem('AdminLogin') === 'true';

    if (!isAuthenticated) {
        return <Navigate to='/AdminUserLogin' />;
    }

    return children;  // Use 'children' instead of 'Children'
};

export default Adminprivaterouting;
