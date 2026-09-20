import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Project } from '../types';
import { playTick } from '../services/audio';

interface FullscreenVideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export const FullscreenVideoModal: React.FC<FullscreenVideoModalProps> = ({
  project,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playTick();
        onClose();
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted((m) => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <motion.div
      id="fullscreen-video-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        playTick();
        onClose();
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md cursor-pointer select-none p-4 sm:p-10"
    >
      {/* Top bar with Project Name & Close button */}
      <div
        className="absolute top-6 left-6 right-6 sm:top-8 sm:left-10 sm:right-10 z-20 flex items-center justify-between pointer-events-none"
      >
        <div className="flex items-center gap-3 font-mono text-xs tracking-wider uppercase text-white/80">
          <span className="font-bold text-sm text-white">{project.name}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60">{project.client}</span>
          {project.duration && (
            <span className="hidden sm:inline text-white/40 font-mono text-[11px]">
              [{project.duration}s]
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mute toggle button */}
          <button
            id="video-mute-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              playTick();
              setIsMuted(!isMuted);
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
              }
            }}
            className="text-white/75 hover:text-white transition-colors cursor-pointer p-2.5 rounded-full hover:bg-white/10"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Close button */}
          <button
            id="video-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              playTick();
              onClose();
            }}
            className="text-white/75 hover:text-white transition-colors cursor-pointer p-2.5 rounded-full hover:bg-white/10"
            title="Close (or click sides)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Centered Video Element: clicking on the video container does NOT close modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-full flex items-center justify-center cursor-default"
      >
        <video
          ref={videoRef}
          src={project.video}
          poster={project.image}
          autoPlay
          playsInline
          loop
          controls
          muted={isMuted}
          className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-none shadow-[0_30px_100px_rgba(0,0,0,0.95)] outline-none bg-black"
        />
      </motion.div>
    </motion.div>
  );
};
