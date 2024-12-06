

import { auth } from '@/lib/services';
import { Navigate, Outlet } from "react-router-dom"

export const PublicLayout = () => {
    
    if(auth.isAuthenticated()){
        return  <Navigate to={'/user'} />;
    }
    return  <Navigate to={'/'} />;
}

export const PrivateLayout = () => {

    if (!auth.isAuthenticated()) {
        return <Navigate to={"/"} />;
    }
    return <><Outlet /></> 
}