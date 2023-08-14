import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from '../firebase'

const authContext = createContext();

const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error('Este no es una aurtenticacion');
    return context;
};

function AuthProvider({ children }) {
    const usuariosCollection = collection(firestore, "usuarios");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth)
    const loginWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider)
    }
    const resetPassword = (email) => sendPasswordResetEmail(auth, email)



    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            if(!currentUser) {
                setUser(null);
                setLoading(false);
                return;
            }
            const userRef = doc(usuariosCollection, currentUser?.uid);

            getDoc(userRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        setUser({
                            ...currentUser,
                            firestoreData: userData
                        })
                    } else {
                        setUser({
                            ...currentUser,
                            firestoreData: null
                        })
                    }
                })
                .catch((error) => {
                    setUser({
                        ...currentUser,
                        firestoreData: null
                    });
                });

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