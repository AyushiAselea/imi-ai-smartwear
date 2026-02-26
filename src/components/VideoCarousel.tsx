import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from "lucide-react";

const videos = [
  { src: "https://res.cloudinary.com/dvvifezwm/video/upload/v1772027820/imi_ved3_vnjdl5.mp4", title: "IMI Smart Features" },
  { src: "https://res.cloudinary.com/dvvifezwm/video/upload/v1772027816/imi_ved2_akl631.mp4", title: "IMI in Action" },
  { src: "https://res.cloudinary.com/dvvifezwm/video/upload/v1772027791/imi_ved3_yzdei3.mp4", title: "Everyday Style" },
  { src: "https://res.cloudinary.com/dvvifezwm/video/upload/v1772027803/imi_ved4_l3lh7b.mp4", title: "AI Vision" },
];

const VideoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null, i: number) => {
      videoRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        v.currentTime = 0;
        v.muted = isMuted;
        if (isPlaying) v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [activeIndex, isMuted, isPlaying]);

  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const handleNav = (dir: 1 | -1) => {
    setActiveIndex((prev) => (prev + dir + videos.length) % videos.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      const v = videoRefs.current[activeIndex];
      if (v) v.muted = next;
      return next;
    });
  };

  const togglePlay = () => {
    const v = videoRefs.current[activeIndex];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 uppercase">
            User Videos
          </h2>
        </motion.div>
      </div>

      {/* Side-by-side vertical video cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative flex items-center">
          {/* Left nav */}
          <button
            onClick={() => handleNav(-1)}
            className="absolute -left-2 sm:left-0 z-30 p-2.5 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Previous video"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right nav */}
          <button
            onClick={() => handleNav(1)}
            className="absolute -right-2 sm:right-0 z-30 p-2.5 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Next video"
          >
            <ChevronRight size={20} />
          </button>

          {/* Video grid showing 3 at a time — center is active */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-10 sm:px-14">
            {[-1, 0, 1].map((offset) => {
              const idx = (activeIndex + offset + videos.length) % videos.length;
              const isMain = offset === 0;

              return (
                <motion.div
                  key={`${idx}-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.abs(offset) * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden bg-black cursor-pointer shadow-xl ${
                    offset === 0 ? "" : offset === -1 ? "hidden sm:block" : "hidden lg:block"
                  }`}
                  style={{ aspectRatio: "9/16" }}
                  onClick={() => {
                    if (!isMain) goTo(idx);
                  }}
                >
                  <video
                    ref={(el) => setVideoRef(el, idx)}
                    src={videos[idx].src}
                    className="w-full h-full object-cover"
                    muted={isMain ? isMuted : true}
                    playsInline
                    autoPlay={isMain}
                    loop={false}
                    preload={offset <= 1 ? "auto" : "metadata"}
                    onEnded={isMain ? handleVideoEnd : undefined}
                  />

                  {/* Overlay for non-active */}
                  {!isMain && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}

                  {/* Controls for active video */}
                  {isMain && (
                    <>
                      {/* Play/Pause top-left */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      {/* Mute toggle top-right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>

                      {/* Title bottom-left */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="text-sm font-semibold text-white drop-shadow-lg">
                          {videos[idx].title}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              }`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
