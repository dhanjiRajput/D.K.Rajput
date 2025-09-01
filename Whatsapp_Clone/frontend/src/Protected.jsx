import { Navigate, Outlet, useLocation } from "react-router-dom"
import userUserStore from "./store/useUserStore";
import { useEffect, useState } from "react";
import { checkUserAuth } from "./services/user.service";
import Loader from "./utils/Loader";


export const ProtectedRoute = ()=>{
    const location=useLocation();
    const [isChecking,setIsChecking]=useState(true);
    
    const {isAuthenticated,setUser,clearUser}=userUserStore();

    useEffect(()=>{
        const verifyAuth=async()=>{
            try {
                const result=await checkUserAuth();
                if(result?.isAuthenticated){
                    setUser(result.user);
                }else{
                    clearUser();
                }
            } catch (error) {
                console.error("Error checking user authentication:", error);
                clearUser();
            }finally{
                setIsChecking(false);
            }
        }
        verifyAuth();
    }, [setUser,clearUser]);

    if(isChecking){
        return <Loader />;
    }

    if(!isAuthenticated){
        return <Navigate to="/user-login" state={{ from: location }} replace />;
    }

    // User is authenticated, render the protected route
    return <Outlet />;
};

export const PublicRoute = () => {
    const isAuthenticated = userUserStore(state => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};