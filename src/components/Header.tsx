import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { ViewMode } from '../types';
import { playTick, setSoundEnabled } from '../services/audio';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenAbout: () => void;
  soundOn?: boolean;
  setSoundOn?: (on: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenAbout,
  soundOn = true,
  setSoundOn,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModeChange = (mode: ViewMode) => {
    playTick();
    setViewMode(mode);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    playTick();
    if (setSoundOn) {
      setSoundOn(next);
    }
    setSoundEnabled(next);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 px-6 sm:px-10 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] pb-2 pointer-events-none flex items-start justify-between text-sm sm:text-base font-medium tracking-tight">
        {/* Left: RS® Logo + Tagline */}
        <div className="flex items-start gap-4 sm:gap-6 pointer-events-auto">
          <button
            onClick={() => {
              playTick();
              setViewMode('slider');
            }}
            className="text-3xl sm:text-4xl font-extrabold text-[#fcf8ef] tracking-tighter leading-none hover:opacity-75 transition-opacity cursor-pointer flex items-baseline"
          >
            <span>ODD</span>
            <sup className="text-sm font-bold ml-0.5">®</sup>
          </button>

          <div className="hidden md:flex flex-col text-xs sm:text-sm text-[#cbc7c2] leading-tight font-normal uppercase tracking-normal">
            <span>documenting emotion,</span>
            <span>movement and meaning.</span>
          </div>
        </div>

        {/* Center: View Toggles (SLIDER | LIST) - Untouched on md: and above, hidden on mobile */}
        <div className="pointer-events-auto hidden md:flex items-start absolute left-1/2 -translate-x-1/2 top-6">
          <div className="flex items-start gap-5 sm:gap-7">
            {(['slider', 'list'] as const).map((mode) => {
              const isActive = viewMode === mode;
              return (
                <div key={mode} className="flex flex-col items-center">
                  <button
                    id={`view-toggle-${mode}`}
                    onClick={() => handleModeChange(mode)}
                    className={`uppercase font-bold tracking-tight text-sm sm:text-base transition-colors cursor-pointer ${
                      isActive ? 'text-[#f6f4ee]' : 'text-[#c7c4bd]/70 hover:text-[#f6f4ee]'
                    }`}
                  >
                    <span className="roll">
                      <span className="roll-inner">
                        <span className="roll-face">{mode}</span>
                        <span className="roll-face text-white">{mode}</span>
                      </span>
                    </span>
                  </button>

                  {/* Active underline indicator */}
                  <div className="h-[2px] flex items-center justify-center mt-[2px] w-full relative">
                    {isActive && (
                      <motion.div
                        layoutId="active-view-indicator-underline"
                        className="w-1/2 max-w-[20px] h-[2px] bg-[#2554f2]"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Desktop Navigation (About + Contact) - Untouched on md: and above */}
        <div className="pointer-events-auto hidden md:flex items-start gap-6 sm:gap-8">
          {/* ABOUT */}
          <button
            id="nav-about-btn"
            onClick={() => {
              playTick();
              onOpenAbout();
            }}
            className="text-xs sm:text-sm uppercase text-[#cbc7c2]/80 hover:text-[#fcf8ef] transition-colors cursor-pointer font-medium"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">about</span>
                <span className="roll-face text-white">about</span>
              </span>
            </span>
          </button>

          {/* CONTACT */}
          <a
            id="nav-contact-link"
            href="mailto:hello@oddmango.com"
            onClick={() => playTick()}
            className="text-xs sm:text-sm uppercase text-[#cbc7c2]/80 hover:text-[#fcf8ef] transition-colors cursor-pointer font-medium"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">contact</span>
                <span className="roll-face text-white">contact</span>
              </span>
            </span>
          </a>
        </div>

        {/* Right: Mobile Hamburger Button (Visible only on mobile screen) */}
        <div className="pointer-events-auto md:hidden">
          <button
            id="mobile-hamburger-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => {
              playTick();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            className="p-2 -mr-2 flex items-center justify-center text-[#fcf8ef] hover:opacity-75 active:scale-90 transition-all cursor-pointer drop-shadow-md"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0c0d10]/98 backdrop-blur-2xl flex flex-col justify-between p-6 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] select-none md:hidden"
          >
            {/* Drawer Top: Logo + Close */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1 text-3xl font-extrabold text-[#fcf8ef] tracking-tighter">
                <span>ODD</span>
                <sup className="text-xs font-bold">®</sup>
              </div>

              <button
                onClick={() => {
                  playTick();
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Close menu"
                className="p-2 -mr-2 flex items-center justify-center text-[#fcf8ef] hover:opacity-75 active:scale-90 transition-transform cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Center: Links & Controls */}
            <div className="flex flex-col gap-8 my-auto py-6">
              {/* Primary Links */}
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => {
                    playTick();
                    setIsMobileMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="flex items-center justify-between text-left text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#fcf8ef] hover:text-[#2554f2] transition-colors cursor-pointer group"
                >
                  <span>About Studio</span>
                  <ArrowUpRight className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={28} />
                </button>

                <a
                  href="mailto:hello@oddmango.com"
                  onClick={() => {
                    playTick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-left text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#fcf8ef] hover:text-[#2554f2] transition-colors cursor-pointer group"
                >
                  <span>Contact</span>
                  <ArrowUpRight className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={28} />
                </a>
              </div>

              {/* Status & Options Card */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#c7c4bd]">
                  <span>Audio Feedback</span>
                  <button
                    onClick={handleToggleSound}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[#fcf8ef] active:scale-95 transition-all cursor-pointer"
                  >
                    {soundOn ? <Volume2 size={14} className="text-[#2554f2]" /> : <VolumeX size={14} />}
                    <span>{soundOn ? 'SOUND : ON' : 'SOUND : OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom: Studio Location & Year */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-1 text-xs font-mono text-[#c7c4bd]/70 uppercase">
              <div className="flex justify-between">
                <span>Johannesburg, SA</span>
                <span>Since ©2016</span>
              </div>
              <p className="text-[10px] text-[#c7c4bd]/40 mt-1">
                Documenting emotion, movement and meaning.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
