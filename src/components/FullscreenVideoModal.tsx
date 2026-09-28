import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../types';
import { playTick, playShutter } from '../services/audio';

interface FullscreenVideoModalProps {
  project: Project | null;
  onClose: () => void;
  soundOn?: boolean;
  setSoundOn?: (val: boolean) => void;
  totalProjectsCount?: number;
}

export const FullscreenVideoModal: React.FC<FullscreenVideoModalProps> = ({
  project,
  onClose,
  soundOn = true,
  setSoundOn,
  totalProjectsCount = 21,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(!soundOn);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(project?.duration || 0);

  // High-frequency requestAnimationFrame loop for liquid, ultra-smooth progress bar progression (60/120Hz)
  useEffect(() => {
    let animId: number;

    const renderProgress = () => {
      const video = videoRef.current;
      if (video && video.duration > 0) {
        const progress = Math.min(1, Math.max(0, video.currentTime / video.duration));
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }
      }
      animId = requestAnimationFrame(renderProgress);
    };

    animId = requestAnimationFrame(renderProgress);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-play on mount with user-specified audio preference
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !soundOn;
    setIsMuted(!soundOn);

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser policy rejects unmuted autoplay, fallback to muted autoplay
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
    }
  }, [soundOn, project]);

  // Video time tracking for bottom scrubber bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleToggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playTick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {});
      }
    }

    if (setSoundOn) {
      setSoundOn(!nextMuted);
    }
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playShutter();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playTick();
        onClose();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, isMuted]);

  if (!project) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      key={`fullscreen-video-wrapper-${project.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto"
    >
      {/* 1. BLUE SLIDE: Glides across and fully covers the entire screen first */}
      <motion.div
        key={`blue-slide-video-${project.id}`}
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

      {/* 2. FULLSCREEN VIDEO SCREEN: Arrives right behind blue slide with silky smooth deceleration */}
      <motion.div
        id="fullscreen-video-screen"
        key={`video-content-slide-${project.id}`}
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
        className="fixed inset-0 z-[55] bg-black text-[#fcf8ef] select-none flex flex-col justify-between overflow-hidden shadow-[-35px_0_80px_rgba(0,0,0,0.45)] pointer-events-auto"
      >
        {/* Fullscreen Video: Plays seamlessly Edge-to-Edge */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden bg-black cursor-pointer"
          onClick={handleTogglePlay}
        >
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            autoPlay
            playsInline
            loop
            muted={isMuted}
            className="w-full h-full object-cover select-none"
          />
        </div>

        {/* UPPER NAVBAR: Positioned cleanly OVER the fullscreen video */}
        <header className="relative z-30 px-6 sm:px-10 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] pb-8 flex items-start justify-between text-sm sm:text-base font-medium tracking-tight bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
          {/* Top-Left: RS® Logo */}
          <button
            id="video-home-btn"
            onClick={() => {
              playTick();
              onClose();
            }}
            className="text-3xl sm:text-4xl font-extrabold text-[#fcf8ef] tracking-tighter leading-none hover:opacity-75 transition-opacity cursor-pointer flex items-baseline pointer-events-auto drop-shadow-md"
          >
            <span>ODD</span>
            <sup className="text-xs sm:text-sm font-bold ml-0.5 relative -top-3">®</sup>
          </button>

          {/* Top-Center: Project Name & Client */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#fcf8ef] drop-shadow-md">
              {project.name}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#cbc7c2]/80 mt-0.5 drop-shadow">
              {project.client} {project.tag ? `• ${project.tag}` : ''}
            </span>
          </div>

          {/* Top-Right: Works count & Close */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium tracking-wider uppercase text-[#cbc7c2]/90 pointer-events-auto">
            <button
              id="video-btn-works"
              onClick={() => {
                playTick();
                onClose();
              }}
              className="hidden sm:inline-block hover:text-[#fcf8ef] transition-colors cursor-pointer drop-shadow-md"
            >
              works({totalProjectsCount})
            </button>
            <button
              id="video-close-btn"
              onClick={() => {
                playTick();
                onClose();
              }}
              className="text-[#fcf8ef] hover:opacity-70 transition-opacity p-1 cursor-pointer drop-shadow-md"
              title="Close Video"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* BOTTOM CONTROLS: Overlaid ON the video with Sound and Playback options */}
        <footer className="relative z-30 px-6 sm:px-10 pb-[max(1.75rem,calc(env(safe-area-inset-bottom)+1rem))] pt-12 flex flex-col justify-end gap-3 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono tracking-tight pointer-events-auto">
            {/* Bottom-Left: Sound Option + Play/Pause */}
            <div className="flex items-center gap-5 sm:gap-7">
              {/* Sound on/off toggle */}
              <button
                id="video-sound-toggle-btn"
                onClick={handleToggleMute}
                className="text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase tracking-wider"
                title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
              >
                <span className="roll">
                  <span className="roll-inner">
                    <span className="roll-face">sound : [{isMuted ? 'off' : 'on'}]</span>
                    <span className="roll-face text-white">sound : [{isMuted ? 'off' : 'on'}]</span>
                  </span>
                </span>
              </button>

              {/* Play / Pause toggle */}
              <button
                id="video-playback-toggle-btn"
                onClick={handleTogglePlay}
                className="text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase tracking-wider"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <span className="roll">
                  <span className="roll-inner">
                    <span className="roll-face">[{isPlaying ? 'pause' : 'play'}]</span>
                    <span className="roll-face text-white">[{isPlaying ? 'pause' : 'play'}]</span>
                  </span>
                </span>
              </button>
            </div>

            {/* Bottom-Center: Project Name & Type */}
            <div className="hidden md:flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono uppercase text-[#cbc7c2]/70 tracking-wider">
                {project.type.toUpperCase()}[{formatTime(currentTime)} / {formatTime(duration)}]
              </span>
            </div>

            {/* Bottom-Right: Time */}
            <div className="flex items-center text-xs font-mono text-[#cbc7c2]/80 uppercase">
              <span className="text-[11px] sm:text-xs tracking-wider">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Slim Interactive Progress / Scrubber Bar at bottom edge */}
          <div
            className="w-full h-1 bg-white/20 hover:h-1.5 transition-all cursor-pointer relative rounded-full overflow-hidden pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              if (videoRef.current && duration > 0) {
                videoRef.current.currentTime = ratio * duration;
                if (progressFillRef.current) {
                  progressFillRef.current.style.transform = `scaleX(${ratio})`;
                }
                playTick();
              }
            }}
          >
            <div
              ref={progressFillRef}
              className="h-full w-full bg-[#2554f2] origin-left will-change-transform"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </footer>
      </motion.div>
    </motion.div>
  );
};
