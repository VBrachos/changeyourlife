'use client'

import React, { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
      setLoading(false);
    };
    
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      <div className="grid gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p className="text-gray-700">{course.description}</p>
            <video controls className="w-full mt-2">
              <source src={course.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
