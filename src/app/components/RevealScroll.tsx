"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const data = [
  { title: "Digital Architecture", image: "/images/x.com/2334.jpg" },
  { title: "Horizon Beyond", image: "/images/x.com/2334.jpg" },
  { title: "Sound Wave Circuit", image: "/images/x.com/2334.jpg" },
  { title: "Light Writer", image: "/images/x.com/2334.jpg" },
  { title: "Star Explorer", image: "/images/x.com/2334.jpg" },
];

export const ImageRevealScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cycleProgress = useTransform(scrollYProgress, [0, 1], [0, data.length]);

  useEffect(() => {
    const unsubscribe = cycleProgress.on("change", (value) => {
      const cycle = Math.floor(value);
      if (cycle !== currentIndex && cycle < data.length) setCurrentIndex(cycle);
      setScrollProgress(value);
    });
    return unsubscribe;
  }, [cycleProgress, currentIndex]);

  const getImageScale = (index: number) => {
    const progress = scrollProgress - Math.floor(scrollProgress);
    if (index === currentIndex) return 1 - 0.25 * progress;
    return index < currentIndex ? 0.75 : 1.25;
  };

  const getImageStyle = (index: number) => {
    const progress = scrollProgress - Math.floor(scrollProgress);

    if (index === currentIndex) {
      const clipProgress = Math.min(progress * 2, 1); // exakt wie Original
      const clipPath = `polygon(0% ${100 - clipProgress * 100}%, 100% ${
        100 - clipProgress * 100
      }%, 100% 100%, 0% 100%)`;
      const brightness = 1 + (1 - clipProgress) * 2;
      const contrast = 1 + (1 - clipProgress) * 1.5;
      return { opacity: 1, clipPath, filter: `brightness(${brightness}) contrast(${contrast})` };
    }

    if (index < currentIndex) {
      const shouldHide = progress > 0.5;
      return {
        opacity: shouldHide ? 0 : 1,
        clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
        filter: "brightness(1) contrast(1)",
      };
    }

    return {
      opacity: 0,
      clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)",
      filter: "brightness(3) contrast(2.5)",
    };
  };

  const getProgressHeight = () => {
    const cycle = Math.floor(scrollProgress);
    const fraction = scrollProgress - cycle;
    return cycle < data.length ? `${fraction * 100}%` : "100%";
  };

  return (
    <div ref={containerRef} className="h-[1000vh] w-full">
      <section className="sticky top-0 h-screen w-full bg-[#121212]">
        {/* Progress Bar */}
        <div className="h-30 absolute right-4 top-1/2 w-0.5 -translate-x-1/2 -translate-y-1/2 transform bg-[rgb(40,40,40)] lg:right-12">
          <motion.div
            className="absolute left-0 top-0 z-10 w-full bg-white"
            style={{ height: getProgressHeight() }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Images */}
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform"
            style={{ scale: getImageScale(index), ...getImageStyle(index) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
};
