import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedPage = ({ children }) => {

    const [user, setUser] = useState(localStorage.getItem('user'));
    
    // Redirect to login page if not authenticated
    return user ? children : <Navigate to="/login" />;
}

export default ProtectedPage