import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../types';
import { playTick, playShutter } from '../services/audio';

interface StillGalleryModalProps {
  project: Project | null;
  onClose: () => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  gesturesOn: boolean;
  setGesturesOn: (val: boolean) => void;
  totalProjectsCount?: number;
}

export const StillGalleryModal: React.FC<StillGalleryModalProps> = ({
  project,
  onClose,
  soundOn,
  setSoundOn,
  gesturesOn,
  setGesturesOn,
  totalProjectsCount = 21,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentDragRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Sync image height and dimensions to match the main screen (SliderView) exactly
  const [frameDimensions, setFrameDimensions] = useState({ width: 395, height: 573 });

  useEffect(() => {
    const updateSize = () => {
      const h = typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 800;
      const w = typeof window !== 'undefined' ? (window.visualViewport?.width ?? window.innerWidth) : 1200;
      const isMobile = w < 768;

      if (isMobile) {
        setFrameDimensions({
          width: w,
          height: Math.round(h * 0.72),
        });
      } else {
        const availableH = h - 210;
        const baseH = Math.max(availableH, 260);
        const finalH = baseH + 23;

        const targetW = Math.round(baseH * 0.72);
        const finalW = Math.min(targetW, Math.round(w * 0.85));

        setFrameDimensions({
          width: Math.max(finalW, 220),
          height: Math.max(finalH, 283),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.visualViewport?.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.visualViewport?.removeEventListener('resize', updateSize);
    };
  }, []);

  // Card width matches main screen frame width
  const cardWidth = frameDimensions.width;

  // Gallery items for this project
  const gallery = project?.gallery && project.gallery.length > 0 ? project.gallery : [project?.image || ''];

  // Reset index whenever project opens
  useEffect(() => {
    setCurrentIndex(0);
    setFullscreenIndex(null);
    setDragOffset(0);
  }, [project]);

  const handlePrev = useCallback(() => {
    playShutter();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  }, [gallery.length]);

  const handleNext = useCallback(() => {
    playShutter();
    setCurrentIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  }, [gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenIndex !== null) {
          playTick();
          setFullscreenIndex(null);
          return;
        }
        playTick();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (fullscreenIndex !== null) {
          playShutter();
          setFullscreenIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
        } else {
          handlePrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (fullscreenIndex !== null) {
          playShutter();
          setFullscreenIndex((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
          setCurrentIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
        } else {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose, handlePrev, handleNext, fullscreenIndex, gallery.length]);

  // Mouse / Touch drag to scroll through images
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!gesturesOn && e.pointerType === 'mouse') {
      // If gestures are off, still allow natural clicking
    }
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentDragRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    currentDragRef.current = diff;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    const threshold = 65;
    if (currentDragRef.current < -threshold) {
      handleNext();
    } else if (currentDragRef.current > threshold) {
      handlePrev();
    }
    setDragOffset(0);
    currentDragRef.current = 0;
  };

  // Smooth wheel gesture handling with momentum protection
  const wheelAccumulatorRef = useRef(0);
  const isWheelLockedRef = useRef(false);
  const wheelCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccumulatorRef.current += delta;
    const WHEEL_THRESHOLD = 30;

    if (!isWheelLockedRef.current && Math.abs(wheelAccumulatorRef.current) >= WHEEL_THRESHOLD) {
      isWheelLockedRef.current = true;
      if (wheelAccumulatorRef.current > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      wheelAccumulatorRef.current = 0;

      if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
      wheelCooldownTimerRef.current = setTimeout(() => {
        isWheelLockedRef.current = false;
        wheelAccumulatorRef.current = 0;
      }, 420);
    }

    if (wheelCooldownTimerRef.current) clearTimeout(wheelCooldownTimerRef.current);
    wheelCooldownTimerRef.current = setTimeout(() => {
      isWheelLockedRef.current = false;
      wheelAccumulatorRef.current = 0;
    }, 280);
  };

  // Click on ruler to jump to slide
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetIdx = Math.min(gallery.length - 1, Math.floor(ratio * gallery.length));
    playShutter();
    setCurrentIndex(targetIdx);
  };

  if (!project) return null;

  // Generate 70 tick marks for the bottom ruler
  const totalTicks = 71;

  return (
    <motion.div
      key={`gallery-screen-wrapper-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto"
    >
      {/* 1. BLUE SLIDE: Glides across and fully covers the entire screen first */}
      <motion.div
        key={`blue-slide-${project.id}`}
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{
          x: '100%',
          transition: { duration: 0.95, delay: 0.45, ease: [0.14, 1, 0.22, 1] },
        }}
        transition={{
          duration: 1.35,
          ease: [0.14, 1, 0.22, 1],
        }}
        style={{ willChange: 'transform' }}
        className="fixed inset-0 z-50 bg-[#2554f2] shadow-[-35px_0_80px_rgba(0,0,0,0.45)] pointer-events-none"
      />

      {/* 2. WHITE SLIDE: Arrives as soon as blue covers the screen, entering slightly faster with smooth deceleration */}
      <motion.div
        id="still-gallery-screen"
        key={`white-slide-${project.id}`}
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{
          x: '100%',
          transition: { duration: 0.9, ease: [0.14, 1, 0.22, 1] },
        }}
        transition={{
          duration: 1.18,
          delay: 0.7,
          ease: [0.12, 1, 0.2, 1],
        }}
        style={{ willChange: 'transform' }}
        className="fixed inset-0 z-[55] bg-white text-[#111111] select-none flex flex-col justify-between overflow-hidden shadow-[-35px_0_80px_rgba(0,0,0,0.25)] pointer-events-auto"
      >
        {/* TOP HEADER */}
        <header className="px-6 sm:px-10 pt-6 pb-2 flex items-start justify-between text-sm sm:text-base font-medium tracking-tight">
          {/* Top-Left: RS® Logo */}
          <button
            id="gallery-home-btn"
            onClick={() => {
              playTick();
              onClose();
            }}
            className="text-3xl sm:text-4xl font-extrabold text-black tracking-tighter leading-none hover:opacity-70 transition-opacity cursor-pointer flex items-baseline"
          >
            <span>ODD</span>
            <sup className="text-xs sm:text-sm font-bold ml-0.5 relative -top-3">®</sup>
          </button>

          {/* Top-Center: Project Name & Client Brand */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black">
              {project.name}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#737373]">
              {project.client}
            </span>
          </div>

          {/* Top-Right: WORKS & Close */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#737373]">
            <button
              id="gallery-btn-works"
              onClick={() => {
                playTick();
                onClose();
              }}
              className="hidden sm:inline-block hover:text-black transition-colors cursor-pointer"
            >
              works({totalProjectsCount})
            </button>
            <button
              id="gallery-close-btn"
              onClick={() => {
                playTick();
                onClose();
              }}
              className="text-black hover:opacity-60 transition-opacity p-1 cursor-pointer"
              title="Close Showcase"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* MAIN STAGE: HORIZONTAL PANORAMIC IMAGE STRIP */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <div
            style={{ height: `${frameDimensions.height}px` }}
            className="relative w-full flex items-center justify-center"
          >
            {gallery.map((imgUrl, idx) => {
              const offset = idx - currentIndex;
              const translateX = offset * cardWidth + dragOffset;
              const isCenter = idx === currentIndex;

              // Only render nearby images for high performance
              if (Math.abs(offset) > 4) return null;

              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    if (Math.abs(currentDragRef.current) > 10) return;
                    e.stopPropagation();
                    playShutter();
                    setCurrentIndex(idx);
                    setFullscreenIndex(idx);
                  }}
                  style={{
                    transform: `translate3d(${translateX}px, 0, 0)`,
                    width: `${frameDimensions.width + 1}px`,
                    height: `${frameDimensions.height}px`,
                    zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="absolute top-0 flex-shrink-0 cursor-pointer overflow-hidden p-0 m-0 border-0 rounded-none bg-black"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.name} ${idx + 1}`}
                    draggable={false}
                    referrerPolicy="no-referrer"
                    className="block w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM INSPECTOR CONTROLS & PRECISION RULER */}
        <footer className="w-full flex flex-col justify-end">
          {/* Top row of bottom bar: Slide Counter & Thumb | SOUND & GESTURES */}
          <div className="px-6 sm:px-10 pb-2 flex items-end justify-center md:justify-between text-xs font-mono font-medium tracking-wider text-[#737373]">
            {/* Bottom-Left */}
            <div className="hidden md:block w-24 sm:w-32" />

            {/* Bottom-Center: 01 / 09 Counter & Scrubber Thumb */}
            <div className="flex flex-col items-center select-none -mb-1">
              <div className="flex flex-col items-center leading-none text-xs font-bold text-black">
                <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                <div className="w-4 h-[1px] bg-black/40 my-0.5" />
                <span>{String(gallery.length).padStart(2, '0')}</span>
              </div>
              {/* Scrubber capsule thumb */}
              <div
                className="w-7 h-1.5 bg-[#222222] rounded-full my-1.5 hover:bg-black transition-colors cursor-grab"
                title="Active slide handle"
              />
            </div>

            {/* Bottom-Right: SOUND : [ON/OFF] */}
            <div className="hidden md:flex items-center gap-6 sm:gap-8">
              <button
                id="gallery-sound-toggle"
                onClick={() => {
                  playTick();
                  setSoundOn(!soundOn);
                }}
                className="hover:text-black transition-colors cursor-pointer uppercase"
              >
                SOUND : [{soundOn ? 'ON' : 'OFF'}]
              </button>
            </div>
          </div>

          {/* Bottom Edge Blue Straight Line Bar - hidden on mobile */}
          <div
            ref={rulerRef}
            onClick={handleRulerClick}
            className="hidden md:flex relative w-full h-4 sm:h-5 items-end cursor-pointer bg-transparent overflow-visible"
          >
            {/* Solid Straight Blue Line */}
            <div className="w-full h-[3px] bg-[#2554f2]" />
          </div>
        </footer>
      </motion.div>

      {/* FULLSCREEN IMAGE LIGHTBOX WITH BLACK TRANSPARENT OVERLAY ON SIDES */}
      <AnimatePresence>
        {fullscreenIndex !== null && gallery[fullscreenIndex] && (
          <motion.div
            id="fullscreen-image-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              playTick();
              setFullscreenIndex(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md cursor-pointer select-none p-4 sm:p-10"
          >
            {/* Minimal close button on side */}
            <button
              id="fullscreen-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                playTick();
                setFullscreenIndex(null);
              }}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 text-white/75 hover:text-white transition-colors cursor-pointer p-2.5 rounded-full hover:bg-white/10"
              title="Close (or click sides)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Smooth scaling image container: clicking image does NOT close; clicking sides closes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-full flex items-center justify-center cursor-default"
            >
              <img
                src={gallery[fullscreenIndex]}
                alt={`${project.name} full screen`}
                draggable={false}
                referrerPolicy="no-referrer"
                className="max-h-[88vh] max-w-[90vw] w-auto h-auto object-contain rounded-none shadow-[0_30px_100px_rgba(0,0,0,0.9)] select-none pointer-events-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
