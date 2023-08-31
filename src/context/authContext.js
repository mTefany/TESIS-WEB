import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth'
import { collection, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from '../firebase'

const authContext = createContext();

const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error('Esto no es una autenticacion');
    return context;
};

function AuthProvider({ children }) {
    const usuariosCollection = collection(firestore, "usuarios");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const login = async (email, password) => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const logout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('user__app');
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const resetPassword = (email) => sendPasswordResetEmail(auth, email)


    useEffect(() => {
        onAuthStateChanged(auth, currentUser => {
            const user = localStorage.getItem('user__app') || null;
            const userJson = user ? JSON.parse(user) : null;

            if (!currentUser?.uid && !userJson?.uid) {
                setUser(null);
                setLoading(false);
                return;
            }

            const userRef = doc(usuariosCollection, currentUser?.uid || userJson?.uid);
            localStorage.setItem('user__app', JSON.stringify(currentUser));

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
        <authContext.Provider value={{ signup, login, user, logout, loading, resetPassword }}>
            {children}
        </authContext.Provider>
    )
};



export { AuthProvider, authContext, useAuth };