"use client";

import { useState } from "react";
import { auth } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();

  // Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Save user to Redux store
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: user.photoURL,
        })
      );

      router.push("/about"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  // Google Signup/Login
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Redux store
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      router.push("/about"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full">Sign Up</button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleSignup} className="btn btn-outline w-full flex items-center gap-2">
          <FcGoogle size={20} />
          Sign Up with Google
        </button>

        <p className="mt-4 text-center">
          Already have an account? <a href="/signin" className="text-blue-600">Sign in</a>
        </p>
      </div>
    </div>
  );
}
