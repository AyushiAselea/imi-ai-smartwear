import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.75;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingIndex === index) {
      video.pause();
      setPlayingIndex(null);
    } else {
      // Pause any currently playing video
      if (playingIndex !== null && videoRefs.current[playingIndex]) {
        videoRefs.current[playingIndex]!.pause();
      }
      video.play();
      setPlayingIndex(index);
    }
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

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] snap-center rounded-2xl overflow-hidden border border-border bg-card group"
              >
                <div className="relative aspect-[9/16] sm:aspect-video">
                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={video.src}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onEnded={() => setPlayingIndex(null)}
                  />
                  {/* Play/Pause overlay */}
                  <button
                    onClick={() => togglePlay(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={playingIndex === i ? "Pause video" : "Play video"}
                  >
                    <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
                      {playingIndex === i ? (
                        <Pause size={32} className="text-white" />
                      ) : (
                        <Play size={32} className="text-white" />
                      )}
                    </div>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-foreground">{video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
