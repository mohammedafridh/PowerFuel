import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../Context/Context';

function ProtectedRoute(props) {
    let {user} = useUserAuth();
    if(!user){
        return <Navigate to = '/login' />;
    }
    return props.children;
};

export default ProtectedRoute