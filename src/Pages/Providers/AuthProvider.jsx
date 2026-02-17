import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { AuthContext } from './AuthContext'
import { app } from '../../firebase/firebase.config'

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }



  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      console.log('CurrentUser-->', currentUser?.email)
      setUser(currentUser)
      setLoading(false)
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  const authInfo = {
    user,
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

export default AuthProvider
