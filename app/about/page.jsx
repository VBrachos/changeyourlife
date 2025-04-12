
'use client'

import { useEffect, useState } from "react";
//import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebaseConfig";


export default function About() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/signin"); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
      setLoading(false);
      
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  if (loading) return <h2>Loading...</h2>;

  

  return (
    <div>
      <h2>About</h2>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          {user.photoURL && <img src={user.photoURL} alt="Profile" width="100" height="100" />}
          <button onClick={handleLogout} style={{ marginTop: "10px" }}>Sign Out</button>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
      <h2>Welcome, {user? user.uid : null}</h2>
      
    </div>
    

  );
}




  

  

