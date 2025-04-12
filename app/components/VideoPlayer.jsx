import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux"; // Import Redux hook
import { db } from "../lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const VideoPlayer = ({ video, courseId }) => {
  const videoRef = useRef(null);
  const [watchedTime, setWatchedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Get the current user from Redux
  const currentUser = useSelector(state => state.auth.user); // Adjust based on your Redux structure

  useEffect(() => {
    if (!currentUser) return;

    const fetchProgress = async () => {
      const progressRef = doc(db, `users/${currentUser.uid}/progress/${video.id}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        setWatchedTime(data.watchedTime || 0);
        setIsCompleted(data.completed || false);
        
        if (videoRef.current) {
          videoRef.current.currentTime = data.watchedTime; // Resume from last watched time
        }
      }
    };

    fetchProgress();
  }, [currentUser, video.id]);

  const handleTimeUpdate = async () => {
    if (!currentUser || !videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const completionThreshold = 0.9; // 90% watched to consider complete

    const progressRef = doc(db, `users/${currentUser.uid}/progress/${video.id}`);
    await setDoc(progressRef, {
      courseId,
      videoId: video.id,
      watchedTime: currentTime,
      completed: currentTime >= duration * completionThreshold
    }, { merge: true });

    setWatchedTime(currentTime);
    if (currentTime >= duration * completionThreshold) {
      setIsCompleted(true);
    }
  };

  return (
    <div className="video-container">
      <video 
        ref={videoRef} 
        src={video.url} 
        controls 
        onTimeUpdate={handleTimeUpdate} 
        className="w-full"
      />
      <p>Watched Time: {watchedTime.toFixed(2)}s</p>
      <p>Status: {isCompleted ? "✅ Completed" : "⏳ In Progress"}</p>
    </div>
  );
};

export default VideoPlayer;
