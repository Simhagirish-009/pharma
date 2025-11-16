import React from "react";
import { Navigate } from "react-router-dom";

const Userprivaterouting = ({ children }) => {
    const isAuthenticated = localStorage.getItem('AdminLogin') === 'false';

    if (!isAuthenticated) {
        return <Navigate to='/AdminUserLogin' />;
    }

    return children;  // Use 'children' instead of 'Children'
};

export default Userprivaterouting;
