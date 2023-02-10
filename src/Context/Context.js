import {createContext, useContext, useEffect, useState} from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import {auth} from '../Firebase/Firebase';

const UserAuthContext = createContext()

export function UserAuthContextProvider({children}) {

    const[user,setUser] = useState(JSON.parse(sessionStorage.getItem('userData')));

    function signUp(email,password){
        return createUserWithEmailAndPassword(auth,email,password);
    }

    function logIn(email,password){
        return signInWithEmailAndPassword(auth, email,password);
    }

    function logOut(){
        sessionStorage.clear();
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            sessionStorage.setItem('userData',JSON.stringify(currentUser));
            setUser(currentUser)
        });
        return ()=>{
            unsubscribe();
        }
    },[]);

    const context = {
        user,
        signUp,
        logIn,
        logOut,
    }

  return (
    <UserAuthContext.Provider value = {context}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth(){
    return useContext(UserAuthContext)
}
