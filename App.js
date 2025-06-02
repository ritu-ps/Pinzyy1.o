import React, { useState, useEffect } from "react";
import Button from "./components/Button";
import Channel from "./components/Channel";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBKRCvR4dcgeynzH4FvV-7ig1__p1xdDIg",
  authDomain: "pinzyy-6004d.firebaseapp.com",
  projectId: "pinzyy-6004d",
  storageBucket: "pinzyy-6004d.firebasestorage.app",
  messagingSenderId: "196078157099",
  appId: "1:196078157099:web:34373c09d95c6ec18dd96e",
  measurementId: "G-QXK0NT61S6"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (initializing) return <div className="loading">Loading...</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pinzyy Chat</h1>
        {user && (
          <div className="user-info">
            <img src={user.photoURL} alt="Profile" className="user-avatar" />
            <span className="user-name">{user.displayName}</span>
            <Button onClick={handleSignOut} className="sign-out-btn">Sign Out</Button>
          </div>
        )}
      </header>
      
      <main className="chat-container">
        {user ? (
          <Channel user={user} db={db} />
        ) : (
          <div className="signin-container">
            <h2>Welcome to Pinzyy Chat</h2>
            <Button onClick={handleSignIn} className="signin-btn">Sign in with Google</Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;