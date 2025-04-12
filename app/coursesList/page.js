"use client"

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const currentUser = useSelector(state => state.auth.user); // Get logged-in user

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const fetchedCourses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(fetchedCourses);
    };

    fetchCourses();
  }, []);

  const fetchProgress = async (courseId) => {
    if (!currentUser) return { completedVideos: 0, totalVideos: 0 };

    const videosRef = collection(db, `courses/${courseId}/videos`);
    const videosSnap = await getDocs(videosRef);
    const totalVideos = videosSnap.size;

    let completedVideos = 0;
    for (const videoDoc of videosSnap.docs) {
      const progressRef = doc(db, `users/${currentUser.uid}/progress/${videoDoc.id}`);
      const progressSnap = await getDoc(progressRef);
      if (progressSnap.exists() && progressSnap.data().completed) {
        completedVideos++;
      }
    }

    return { completedVideos, totalVideos };
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      <div className="grid gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} fetchProgress={fetchProgress} />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ course, fetchProgress }) => {
  const [progress, setProgress] = useState({ completedVideos: 0, totalVideos: 0 });

  useEffect(() => {
    const loadProgress = async () => {
      const progressData = await fetchProgress(course.id);
      setProgress(progressData);
    };
    loadProgress();
  }, [course.id, fetchProgress]);

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-xl font-semibold">{course.title}</h3>
      <p className="text-gray-700">{course.description}</p>
      <p className="text-gray-600 text-sm">
        Progress: {progress.completedVideos}/{progress.totalVideos} videos completed
      </p>
      <Link to={`/course/${course.id}`} className="bg-blue-500 text-white p-2 mt-2 inline-block rounded">
        View Course
      </Link>
    </div>
  );
};

export default CoursesList;
