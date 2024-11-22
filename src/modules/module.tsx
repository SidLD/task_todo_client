

import { auth } from '@/lib/services';
import { getRoleRoutePath } from '../lib/helper';
import { Navigate } from "react-router-dom"
import Guest from '@/layouts/Guest';
import RegisterLayout from '@/layouts/RegisterLayout';
import AdminLayout from '@/layouts/AdminLayout';

export const PublicLayout = () => {
    
    if(auth.isAuthenticated()){
        return  <Navigate to={getRoleRoutePath()} />;
    }
    return (
        <Guest />
    )
}

export const PrivateLayout = () => {
    return < AdminLayout/>
    if (!auth.isAuthenticated()) {
        return <Navigate to={"/login"} />;
    }
    else if (auth.getExpiration() * 1000 <= Date.now()) {
        auth.clear()
        alert("Session Expired")
        return <Navigate to={"/login"} />;
        
    }else{
        return <RegisterLayout />
    }   
}