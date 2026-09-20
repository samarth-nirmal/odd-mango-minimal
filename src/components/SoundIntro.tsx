import React, { useState, useEffect } from 'react';
import { loadSoundAssets, playShutter, setSoundEnabled } from '../services/audio';

interface SoundIntroProps {
  onEnter: (sound: boolean) => void;
}

export const SoundIntro: React.FC<SoundIntroProps> = ({ onEnter }) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = (withSound: boolean) => {
    setIsDismissing(true);
    setSoundEnabled(withSound);
    loadSoundAssets().then(() => {
      if (withSound) {
        playShutter();
      }
    });

    setTimeout(() => {
      onEnter(withSound);
    }, 400);
  };

  return (
    <div
      id="sound-intro-modal"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#111111] text-[#fcf8ef] p-6 sm:p-12 transition-opacity duration-500 select-none ${
        isDismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Space */}
      <div />

      {/* Center Intro Block */}
      <div className="max-w-lg mx-auto text-center flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#fcf8ef] mb-3 flex items-baseline justify-center">
          <span>ODD MANGO</span>
          <sup className="text-sm ml-0.5">®</sup>
        </h1>

        <p className="text-xs sm:text-sm text-[#cbc7c2] leading-relaxed mb-8">
          a boutique production studio with<br />
          unyielding passion for storytelling.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono uppercase">
          <button
            id="enter-with-sound-btn"
            onClick={() => handleEnter(true)}
            className="px-6 py-2.5 border border-[#fcf8ef] text-[#fcf8ef] hover:bg-[#fcf8ef] hover:text-[#111111] transition-all cursor-pointer"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">enter with sound</span>
                <span className="roll-face">enter with sound</span>
              </span>
            </span>
          </button>

          <button
            id="enter-without-sound-btn"
            onClick={() => handleEnter(false)}
            className="px-4 py-2.5 text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">[enter without]</span>
                <span className="roll-face">[enter without]</span>
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Loading Strip & Percentage */}
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[11px] font-mono text-neutral-500">
          {String(progress).padStart(2, '0')}%
        </span>
        <div className="w-full h-2 flex items-center justify-between px-2 opacity-30 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className={`w-px h-2 ${
                i <= (progress / 100) * 60 ? 'bg-[#2554f2]' : 'bg-neutral-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
