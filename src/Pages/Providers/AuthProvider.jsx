import React from 'react'
import  { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

import { app } from '../../firebase/firebase.config'
import { AuthContext } from './AuthContext'

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null) // ডাটাবেজ থেকে আসা ইউজার রোল সেভ থাকবে এখানে
  const [loading, setLoading] = useState(true)

  const signInWithGoogle = async () => {
  setLoading(true)
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    setLoading(false); // এরর হলে লোডিং অফ করে দিন
    console.error("Login failed:", error.message);
  }
}

  const logOut = async () => {
    setLoading(true)
    setDbUser(null); // লগআউট করলে রোলও মুছে যাবে
    return signOut(auth)
  }

  // ইউজার রোল ফেচ করার ফাংশন
  const fetchUserRole = async (email) => {
    try {
      const res = await fetch(`https://api.ashrafulenterprise.com/user/role/${email}`);
      const data = await res.json();
      setDbUser(data);
    } catch (error) {
      console.error("Error fetching role:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)
      
      if (currentUser?.email) {
        // যদি ইউজার থাকে তবেই রোল ফেচ হবে
        await fetchUserRole(currentUser.email);
      } else {
        setDbUser(null);
        setLoading(false);
      }
    })
    return () => unsubscribe();
  }, [])

  const authInfo = {
    user,
    dbUser, // এখন থেকে সব পেজে এটি পাওয়া যাবে
    setUser,
    loading,
    setLoading,
    signInWithGoogle,
    logOut,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider;