"use client";

import { useSelector, useDispatch } from "react-redux";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { clearUser } from "../store/userSlice";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";

export default function Navbar() {
    const user = useSelector((state) => state.user); // Get user from Redux
    const dispatch = useDispatch();
    const router = useRouter();
    const [theme, setTheme] = useState("light"); // Default theme
  
    // Apply theme when changed
    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }, [theme]);
  
    // Load saved theme
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    }, []);
  
    // Toggle Theme
    const toggleTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };
  
    // Handle Sign Out
    const handleSignOut = async () => {
      await auth.signOut();
      dispatch(clearUser()); // Clear user from Redux
      router.push("/signin");
    };
  
    return (
      <nav className="navbar bg-base-100 shadow-md px-4 lg:px-10">
        <div className="flex-1">
          <a href="/" className="text-xl font-bold text-customPrimary">MyApp</a>
          <UserProfile/>
        </div>
  
        <div className="hidden lg:flex gap-4">
          <a href="/dashboard" className="btn btn-ghost">Dashboard</a>
          <a href="/about" className="btn btn-ghost">About</a>
        </div>
  
        {/* Dark Mode Toggle */}
        <label className="swap swap-rotate mx-4">
          <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
          {/* Sun Icon */}
          <svg className="swap-on w-8 h-8 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 4.75a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zM4.75 12a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5h-1.5zM12 18.75a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zM18.75 12a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5h-1.5zM7.22 7.22a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06zM15.66 7.22a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06zM7.22 15.66a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06zM15.66 15.66a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06z"/>
          </svg>
          {/* Moon Icon */}
          <svg className="swap-off w-8 h-8 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-1 19.92 7 7 0 01-1-13.89A10 10 0 0012 2z"/>
          </svg>
        </label>
  
        <div className="flex-none">
          {user.email ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {/* Show user photo or default avatar */}
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 object-cover"
                  />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href="/profile">Profile</a></li>
                <li><button onClick={handleSignOut}>Sign Out</button></li>
              </ul>
            </div>
          ) : (
            <a href="/signin" className="btn btn-primary">Sign In</a>
          )}
        </div>
      </nav>
    );
  }