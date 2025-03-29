'use client'

import React, { useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "courses"), {
        title,
        description,
        videoUrl,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setDescription("");
      setVideoUrl("");
      alert("Course added successfully!");
    } catch (error) {
      alert("Error adding course: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Course Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="w-full p-2 border rounded-lg"
        />
        <textarea 
          placeholder="Course Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          className="w-full p-2 border rounded-lg"
        ></textarea>
        <input 
          type="text" 
          placeholder="Video URL" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
          required 
          className="w-full p-2 border rounded-lg"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
