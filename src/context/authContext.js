import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase.config'

const authContext = createContext();

const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error('Este no es una aurtenticacion');
    return context;
};

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth)
    const loginWithGoogle = () =>{
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup (auth, googleProvider)
    }
    const resetPassword = (email)=> sendPasswordResetEmail(auth, email)
 


    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        })
    }, [])

    return (
        <authContext.Provider value={{ signup, login, user, logout, loading, loginWithGoogle, resetPassword }}>
            {children}
        </authContext.Provider>
    )
};



export { AuthProvider, authContext, useAuth };