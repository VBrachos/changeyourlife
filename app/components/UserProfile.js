"use client";

import { useSelector } from "react-redux";

export default function UserProfile() {
  const { user, loading } = useSelector((state) => state.auth.user);

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>No user logged in.</p>;

  return (
    <div>
      <h2>Welcome, {user.displayName || user.email}</h2>
      {user.photoURL && <img src={user.photoURL} alt="Profile" width={50} />}
      {user.uid}
    </div>
  );
}
