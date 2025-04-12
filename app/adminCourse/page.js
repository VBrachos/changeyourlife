'use client'

import React, { useState, useEffect } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  const fetchVideos = async (courseId) => {
    const videosRef = collection(db, `courses/${courseId}/videos`);
    const querySnapshot = await getDocs(videosRef);
    setVideos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.order - b.order));
  };

  const addCourse = async () => {
    if (!title || !description) return;
    const docRef = await addDoc(collection(db, "courses"), { title, description, totalVideos: 0 });
    setCourses([...courses, { id: docRef.id, title, description, totalVideos: 0 }]);
    setTitle("");
    setDescription("");
  };

  const deleteCourse = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    setCourses(courses.filter(course => course.id !== id));
  };

  const addVideo = async () => {
    if (!selectedCourse || !videoTitle || !videoUrl) return;
    const order = videos.length;
    const videoRef = await addDoc(collection(db, `courses/${selectedCourse}/videos`), {
      title: videoTitle,
      url: videoUrl,
      order
    });
    setVideoTitle("");
    setVideoUrl("");
    fetchVideos(selectedCourse);
  };

  const deleteVideo = async (videoId) => {
    await deleteDoc(doc(db, `courses/${selectedCourse}/videos`, videoId));
    setVideos(videos.filter(video => video.id !== videoId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videos.findIndex(video => video.id === active.id);
    const newIndex = videos.findIndex(video => video.id === over.id);
    const updatedVideos = arrayMove(videos, oldIndex, newIndex);
    setVideos(updatedVideos);

    for (let i = 0; i < updatedVideos.length; i++) {
      await updateDoc(doc(db, `courses/${selectedCourse}/videos`, updatedVideos[i].id), { order: i });
    }
  };

  const SortableVideo = ({ video }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: video.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-2 shadow-md rounded-lg mt-2">
        <p className="text-gray-800">{video.title}</p>
        <button onClick={() => deleteVideo(video.id)} className="bg-red-500 text-white p-1 mt-1">Delete</button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Course Management</h2>
      <div className="mb-4">
        <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 mr-2 w-full" />
        <textarea placeholder="Course Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mt-2"></textarea>
        <button onClick={addCourse} className="bg-blue-500 text-white p-2 mt-2">Add Course</button>
      </div>
      <div className="grid gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p className="text-gray-700">{course.description}</p>
            <p className="text-gray-600 text-sm">Videos: {course.totalVideos}</p>
            <button onClick={() => deleteCourse(course.id)} className="bg-red-500 text-white p-2 mt-2">Delete</button>
            <button onClick={() => { setSelectedCourse(course.id); fetchVideos(course.id); }} className="bg-green-500 text-white p-2 mt-2 ml-2">Manage Videos</button>
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold">Manage Videos for Selected Course</h3>
          <input type="text" placeholder="Video Title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="border p-2 mr-2 w-full" />
          <input type="text" placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border p-2 w-full mt-2" />
          <button onClick={addVideo} className="bg-blue-500 text-white p-2 mt-2">Add Video</button>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={videos.map(video => video.id)} strategy={verticalListSortingStrategy}>
              {videos.map(video => <SortableVideo key={video.id} video={video} />)}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
