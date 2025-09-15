"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import axios from "axios";

export default function Spotlight() {
  const [reelsData, setReelsData] = useState([]); // ✅ fetched reels
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRefs = useRef([]);

  // ✅ Fetch reels from backend
  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get("/api/reels/getReels"); // adjust if different baseURL
        setReelsData(res.data);
      } catch (err) {
        console.error("Error fetching reels:", err);
      }
    };
    fetchReels();
  }, []);

  const nextReel = () =>
    setCurrentIndex((prev) =>
      reelsData.length > 0 ? (prev + 1) % reelsData.length : 0
    );

  const prevReel = () =>
    setCurrentIndex((prev) =>
      reelsData.length > 0 ? (prev === 0 ? reelsData.length - 1 : prev - 1) : 0
    );

  // Ensure only active video plays
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex, reelsData]);

  const togglePlay = () => {
    const activeVideo = videoRefs.current[currentIndex];
    if (!activeVideo) return;
    if (isPlaying) {
      activeVideo.pause();
    } else {
      activeVideo.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Auto slide every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      if (reelsData.length > 0) nextReel();
    }, 7000);
    return () => clearInterval(timer);
  }, [reelsData]);

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-gray-900">
          Spotlight
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Discover trending reels and the most engaging moments 🎬✨
        </p>
      </div>
      <div className="relative max-w-7xl mx-auto h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center h-full">
          {reelsData.map((reel, index) => {
            // find relative position with modulo
            let offset = index - currentIndex;
            if (offset < -Math.floor(reelsData.length / 2))
              offset += reelsData.length;
            if (offset > Math.floor(reelsData.length / 2))
              offset -= reelsData.length;

            const isActive = index === currentIndex;

            let translateX = offset * 290;
            let scale = 0.6;
            let zIndex = 5;

            if (isActive) {
              scale = 1;
              zIndex = 30;
            } else if (Math.abs(offset) === 1) {
              scale = 0.9;
              zIndex = 20;
            } else if (Math.abs(offset) === 2) {
              scale = 0.79;
              zIndex = 10;
            }

            return (
              <div
                key={reel._id}
                className="absolute transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  zIndex,
                }}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="relative rounded-2xl overflow-hidden w-[360px] h-[640px]">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={`http://localhost:5000${reel.videoUrl}`} // ✅ use backend URL
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {!isActive && (
                    <div className="absolute inset-0 bg-black/70"></div>
                  )}

                  {isActive && (
                    <>
                      {/* Play/Pause Overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                      >
                        <div className="bg-black/70 rounded-full p-4">
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </div>
                      </div>

                      {/* Bottom Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="flex items-end justify-between">
                          <div className="flex-1 pr-4">
                            <h3 className="text-white font-semibold text-lg mb-1">
                              {reel.username }
                            </h3>
                            <p className="text-white/90 text-sm leading-relaxed">
                              {reel.description || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {/* <button
          onClick={prevReel}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextReel}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button> */}

        {/* Pagination Dots */}
        <div className="bottom-0 pb-5 flex justify-center space-x-2 z-30">
          {reelsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-500 scale-140"
                  : "bg-black/40 hover:bg-black/90"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
