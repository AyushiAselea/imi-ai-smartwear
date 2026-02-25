import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from "lucide-react";

const videos = [
  { src: "/videos/imi_ved2.mp4", title: "IMI in Action" },
  { src: "/videos/imi_ved3.mp4", title: "Smart Features" },
  { src: "/videos/imi_ved4.mp4", title: "AI Vision" },
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

  // Play active video, pause others
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

  // Helper to get wrapped index
  const getIdx = (offset: number) =>
    (activeIndex + offset + videos.length) % videos.length;

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-background to-card/40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See IMI in Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Watch how IMI smart glasses transform your everyday experience.
          </p>
        </motion.div>
      </div>

      {/* Carousel track */}
      <div className="relative flex items-center justify-center h-[320px] sm:h-[400px] md:h-[480px]">
        {/* Nav buttons */}
        <button
          onClick={() => handleNav(-1)}
          className="absolute left-2 sm:left-6 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors shadow-lg"
          aria-label="Previous video"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => handleNav(1)}
          className="absolute right-2 sm:right-6 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors shadow-lg"
          aria-label="Next video"
        >
          <ChevronRight size={22} />
        </button>

        {/* 5-card spread: -2, -1, 0 (center), +1, +2 */}
        {[-2, -1, 0, 1, 2].map((offset) => {
          const idx = getIdx(offset);
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          // Positioning & sizing
          const translateX =
            offset === 0
              ? "0%"
              : offset === -1
              ? "-115%"
              : offset === 1
              ? "115%"
              : offset === -2
              ? "-210%"
              : "210%";

          const scale = isCenter ? 1 : absOffset === 1 ? 0.78 : 0.6;
          const zIndex = isCenter ? 20 : absOffset === 1 ? 10 : 5;
          const opacity = isCenter ? 1 : absOffset === 1 ? 0.7 : 0.35;

          return (
            <motion.div
              key={`${idx}-${offset}`}
              animate={{
                x: translateX,
                scale,
                opacity,
                zIndex,
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute rounded-2xl overflow-hidden shadow-2xl bg-black cursor-pointer"
              style={{
                width: "min(55vw, 460px)",
                aspectRatio: "16/9",
                zIndex,
              }}
              onClick={() => {
                if (!isCenter) goTo(idx);
              }}
            >
              <video
                ref={(el) => setVideoRef(el, idx)}
                src={videos[idx].src}
                className="w-full h-full object-cover"
                muted={isCenter ? isMuted : true}
                playsInline
                autoPlay={isCenter}
                preload={absOffset <= 1 ? "auto" : "metadata"}
                onEnded={isCenter ? handleVideoEnd : undefined}
              />

              {/* Dark overlay on side cards */}
              {!isCenter && (
                <div className="absolute inset-0 bg-black/40" />
              )}

              {/* Center card controls */}
              {isCenter && (
                <>
                  {/* Play/Pause overlay */}
                  {!isPlaying && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="absolute inset-0 flex items-center justify-center z-10"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </button>
                  )}

                  {/* Sound toggle - bottom right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute bottom-3 right-3 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  {/* Title overlay - bottom left */}
                  <div className="absolute bottom-3 left-3 z-10">
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

      {/* Dot indicators */}
      <div className="flex justify-center gap-2.5 mt-8">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-primary"
                : "w-2 bg-border hover:bg-muted-foreground"
            }`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoCarousel;
