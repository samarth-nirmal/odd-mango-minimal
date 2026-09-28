import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDIO_INFO } from '../data/projects';
import { playTick } from '../services/audio';

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="studio-about-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0e0e0e]/98 backdrop-blur-md p-6 sm:p-12 overflow-y-auto select-none"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div
            className="w-full flex items-center justify-between text-xs sm:text-sm font-medium tracking-tight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#fcf8ef]">ODD</span>
              <sup className="text-xs font-bold">®</sup>
            </div>

            <button
              id="close-about-btn"
              onClick={() => {
                playTick();
                onClose();
              }}
              className="font-mono text-xs uppercase text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer"
            >
              <span className="roll">
                <span className="roll-inner">
                  <span className="roll-face">[close]</span>
                  <span className="roll-face text-white">[close]</span>
                </span>
              </span>
            </button>
          </div>

          {/* Main Minimalist Bio & Philosophy */}
          <div
            className="max-w-3xl my-auto py-8 text-[#fcf8ef]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight mb-6">
              A boutique production studio with unyielding passion for storytelling.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#cbc7c2] font-normal leading-relaxed mb-8 max-w-2xl">
              {STUDIO_INFO.bio}
            </p>

            {/* Client Roster */}
            <div className="mt-8 pt-8 border-t border-neutral-800/60">
              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-4">
                SELECTED CLIENTS & COLLABORATORS
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm uppercase font-mono text-[#cbc7c2]">
                {STUDIO_INFO.trustedClients.map((client) => (
                  <span key={client.slug} className="hover:text-white transition-colors">
                    {client.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Information */}
          <div
            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500 border-t border-neutral-900/60 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span>© 2016–2026 ODD MANGO &bull; PRODUCTION STUDIO</span>
            <a
              href="mailto:hello@oddmango.com"
              className="text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors uppercase"
            >
              HELLO@ODDMANGO.COM
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
