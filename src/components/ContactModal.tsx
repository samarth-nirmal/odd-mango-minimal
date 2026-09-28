import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDIO_INFO, TEAM_MEMBERS } from '../data/projects';
import { playTick } from '../services/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
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
          id="studio-contact-modal"
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
              id="close-contact-btn"
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

          {/* Main Content Area */}
          <div
            className="max-w-3xl my-auto py-8 text-[#fcf8ef] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
              CONTACT & COMMISSION
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight mb-8">
              Let’s discuss stories, motion, and visual directions.
            </h1>

            {/* Contact Info Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                  GENERAL INQUIRIES
                </p>
                <a
                  href="mailto:hello@oddmango.com"
                  onClick={() => playTick()}
                  className="text-base sm:text-lg text-[#fcf8ef] hover:text-[#2554f2] transition-colors font-mono tracking-tight block"
                >
                  {STUDIO_INFO.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                  STUDIO LOCATION
                </p>
                <p className="text-base sm:text-lg text-[#cbc7c2] font-mono tracking-tight">
                  {STUDIO_INFO.location}
                </p>
              </div>
            </div>

            {/* Minimal Team Section with 2 people */}
            <div className="pt-8 border-t border-neutral-800/60">
              <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-6">
                TEAM
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="flex flex-col">
                    <span className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#fcf8ef]">
                      {member.name}
                    </span>
                    <span className="text-xs font-mono uppercase text-[#cbc7c2]/80 mt-0.5 tracking-wider">
                      {member.role}
                    </span>
                    <a
                      href={`mailto:${member.email}`}
                      onClick={() => playTick()}
                      className="text-xs font-mono text-[#cbc7c2]/60 hover:text-[#fcf8ef] transition-colors mt-2"
                    >
                      {member.email}
                    </a>
                  </div>
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
            <span className="text-[#cbc7c2] uppercase">
              {STUDIO_INFO.instagram}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
