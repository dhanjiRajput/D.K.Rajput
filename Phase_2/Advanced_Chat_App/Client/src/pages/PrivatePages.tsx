import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';
import { Outlet } from 'react-router-dom';

const PrivatePages = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isAuthUser, setIsAuthUser] = React.useState<boolean>(false);
    const [isCheUser, setIsCheUser] = React.useState<boolean>(false);
    const context = useContext(AuthContext);
    if (!context) {
        debugger;
        return <div className="text-white p-4">Auth context not available</div>;
    }

    const { checkAuth, authUser } = context;

    // Optional: Add a fallback or error if context is missing
    useEffect(() => {
        if (!checkAuth) {
            console.error("checkAuth function is not available in AuthContext");
        } else {
            (async () => {
                await checkAuth();
                setIsCheUser(true);
            })()    
        }
    }, [])


    React.useEffect(() => {
        {
            if (isCheUser) {
                if (authUser) { setIsAuthUser(true); } else { setIsAuthUser(false); }
                console.log("authUser", authUser);
                setIsLoading(false);
            }
        }
    }, [authUser, isCheUser]);

    if (isLoading) {
        return <div className="text-white p-4">Loading...</div>;
    }
    if (!isAuthUser) {
        return <LoginPage />;
    }

    return (
        <Outlet />
    )
}

export default PrivatePages