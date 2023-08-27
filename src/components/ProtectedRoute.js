import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}){
    const userLocal = localStorage.getItem('user__app') || null;
    const userJson = userLocal ? JSON.parse(userLocal) : null;

    const {user, loading} = useAuth()

    if(loading) return <h1>Loading</h1>
    if (!user && !userJson) return <Navigate to='/login'/>

    return <>{children}</>
}

export default ProtectedRoute;