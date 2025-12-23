'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselItems = [
  {
    video: '/assets/videos/video0.mp4',
    title: 'XMAS OFFERS',
    subtitle: '50% FREE CHIPS',
  },
  {
    video: '/assets/videos/video1.mp4',
    title: 'NEW YEAR DEALS',
    subtitle: '70% EXTRA BONUS',
  },
  {
    video: '/assets/videos/video2.mp4',
    title: 'EXCLUSIVE GIFTS',
    subtitle: 'FOR NEW USERS',
  },
  {
    video: '/assets/videos/video3.mp4',
    title: 'WINTER SPECIAL',
    subtitle: 'FREE CREDITS',
  },
  {
    video: '/assets/videos/video4.mp4',
    title: 'LIMITED OFFER',
    subtitle: 'CLAIM NOW',
  },
  {
    video: '/assets/videos/video5.mp4',
    title: 'HOLIDAY MAGIC',
    subtitle: 'JOIN THE FUN',
  },
  {
    video: '/assets/videos/video6.mp4',
    title: 'SECRET SANTA',
    subtitle: 'GET YOUR GIFT',
  },
];

const MobileHeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[1/1.2] overflow-hidden md:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <video
            src={carouselItems[currentIndex].video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6">
            <h2 className="text-5xl font-extrabold text-[#FF1493] text-center mb-1 tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {carouselItems[currentIndex].title}
            </h2>
            <p className="text-4xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {carouselItems[currentIndex].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileHeroCarousel;

