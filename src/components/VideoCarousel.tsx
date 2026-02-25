import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import ved1 from "@/assets/imi ved1.mp4";
import ved2 from "@/assets/imi ved2.mp4";
import ved3 from "@/assets/imi ved3.mp4";
import ved4 from "@/assets/imi ved4.mp4";

const videos = [
  { src: ved1, title: "IMI in Action" },
  { src: ved2, title: "Smart Features" },
  { src: ved3, title: "AI Vision" },
  { src: ved4, title: "Everyday Style" },
];

const VideoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // When video ends, go to next
  const handleVideoEnd = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const goTo = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleNav = (dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex((prev) => (prev + dir + videos.length) % videos.length);
  };

  // Play video when activeIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, isMuted]);

  // Toggle mute on the current video
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
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

        <div className="relative max-w-3xl mx-auto">
          {/* Prev */}
          <button
            onClick={() => handleNav(-1)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors shadow-lg"
            aria-label="Previous video"
          >
            <ChevronLeft size={22} />
          </button>
          {/* Next */}
          <button
            onClick={() => handleNav(1)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors shadow-lg"
            aria-label="Next video"
          >
            <ChevronRight size={22} />
          </button>

          {/* Video window */}
          <div className="rounded-2xl overflow-hidden border border-primary/30 shadow-xl bg-black">
            <div className="relative aspect-video overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.video
                  key={activeIndex}
                  ref={videoRef}
                  src={videos[activeIndex].src}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleVideoEnd}
                />
              </AnimatePresence>

              {/* Sound toggle */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            {/* Title bar */}
            <div className="px-5 py-3 flex items-center justify-between bg-card/80 backdrop-blur-sm">
              <span className="text-sm font-semibold text-foreground">
                {videos[activeIndex].title}
              </span>
              <span className="text-xs text-muted-foreground">
                {activeIndex + 1} / {videos.length}
              </span>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
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

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  i === activeIndex
                    ? "border-primary scale-105 shadow-md"
                    : "border-border opacity-60 hover:opacity-90"
                }`}
              >
                <video
                  src={v.src}
                  className="w-full aspect-video object-cover pointer-events-none"
                  muted
                  preload="metadata"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
