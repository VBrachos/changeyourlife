'use client'

import { signOut } from "firebase/auth";
//import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../lib/firebaseConfig";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).then(() => {
      router.push("/signin"); // Redirect to sign-in page after logout
    });
  }, []);

  return <h2>Signing out...</h2>;
}
