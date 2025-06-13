import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; 

export const WatchEpisode = (props) => {
  const videoSrc = props.video; // 

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => { /* ... */ };
    video.addEventListener("play", handlePlay);
    return () => {
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <div className="text-center mt-5">
      <video
        ref={videoRef}
        className="video-element"
        id="video-element"
        preload="auto"
        controls
      >
        <source src={videoSrc} />
      </video>
    </div>
  );
};