import React from 'react';
import { Project, CurveMode } from '../types';
import { playTick, setSoundEnabled } from '../services/audio';

interface FooterProps {
  currentProject?: Project | null;
  projects: Project[];
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  fisheyeOn: boolean;
  setFisheyeOn: (on: boolean) => void;
  curveMode: CurveMode;
  setCurveMode: (mode: CurveMode) => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  gesturesOn: boolean;
  setGesturesOn: (on: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentProject,
  projects,
  currentIndex,
  onSelectIndex,
  fisheyeOn,
  setFisheyeOn,
  curveMode,
  setCurveMode,
  soundOn,
  setSoundOn,
  gesturesOn,
  setGesturesOn,
}) => {
  const toggleFisheye = () => {
    playTick();
    setFisheyeOn(!fisheyeOn);
  };

  const cycleCurve = () => {
    playTick();
    const modes: CurveMode[] = ['arc', 'cylinder', 'arch', 'off'];
    const nextIdx = (modes.indexOf(curveMode) + 1) % modes.length;
    setCurveMode(modes[nextIdx]);
  };

  const toggleSound = () => {
    const next = !soundOn;
    playTick();
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const toggleGestures = () => {
    playTick();
    setGesturesOn(!gesturesOn);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none select-none flex flex-col justify-end">
      {/* Middle row of bottom chrome: Fisheye + Curve | Project Title & Meta | Sound & Gestures - Shown on md: and above */}
      <div className="px-6 sm:px-10 pb-4 hidden md:flex items-end justify-between text-sm sm:text-base font-medium tracking-tight">
        {/* Bottom-Left: Fisheye Toggle + Curve Toggle */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-6">
          {/* Fisheye Toggle */}
          <button
            id="fisheye-toggle"
            onClick={toggleFisheye}
            className="text-xs sm:text-sm text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase font-mono tracking-tight"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">
                  fisheye : [{fisheyeOn ? 'on' : 'off'}]
                </span>
                <span className="roll-face text-white">
                  fisheye : [{fisheyeOn ? 'on' : 'off'}]
                </span>
              </span>
            </span>
          </button>

          {/* Curve Mode Toggle */}
          <button
            id="curve-toggle"
            onClick={cycleCurve}
            className="text-xs sm:text-sm text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase font-mono tracking-tight"
            title="Toggle curved 3D ribbon style"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">
                  curve : [{curveMode}]
                </span>
                <span className="roll-face text-white">
                  curve : [{curveMode}]
                </span>
              </span>
            </span>
          </button>
        </div>

        {/* Center: Project Name + Meta (Desktop only, mobile has title on the card itself) */}
        {currentProject && (
          <div className="hidden md:flex pointer-events-auto flex-col items-center absolute left-1/2 -translate-x-1/2 bottom-5 sm:bottom-6 text-center max-w-[50vw]">
            {/* Project Name */}
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-[#f6f4ee] leading-tight truncate max-w-full">
              {currentProject.name}
            </h2>

            {/* Project Meta Line: e.g. STILLS[6] • EVENTS */}
            <p className="text-xs sm:text-[13px] font-mono uppercase text-[#c7c4bd]/80 mt-0.5 tracking-wider">
              {currentProject.type.toUpperCase()}[{currentProject.count}] • {currentProject.tag.toUpperCase()}
            </p>
          </div>
        )}

        {/* Bottom-Right: Sound Toggle + Gestures Toggle */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {/* Sound Toggle */}
          <button
            id="sound-toggle"
            onClick={toggleSound}
            className="text-xs sm:text-sm text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase font-mono tracking-tight"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">
                  sound : [{soundOn ? 'on' : 'off'}]
                </span>
                <span className="roll-face text-white">
                  sound : [{soundOn ? 'on' : 'off'}]
                </span>
              </span>
            </span>
          </button>

          {/* Gestures Toggle */}
          <button
            id="gestures-toggle"
            onClick={toggleGestures}
            className="text-xs sm:text-sm text-[#cbc7c2] hover:text-[#fcf8ef] transition-colors cursor-pointer uppercase font-mono tracking-tight hidden sm:inline-block"
          >
            <span className="roll">
              <span className="roll-inner">
                <span className="roll-face">
                  gestures : [{gesturesOn ? 'on' : 'off'}]
                </span>
                <span className="roll-face text-white">
                  gestures : [{gesturesOn ? 'on' : 'off'}]
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Full-width Blue Straight Line Bottom Bar across the bottom edge - hidden on mobile */}
      <div
        id="bottom-straight-bar"
        className="hidden md:block pointer-events-auto w-full h-[3px] bg-[#2554f2] relative cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, clickX / rect.width));
          const targetIndex = Math.floor(pct * projects.length);
          playTick();
          onSelectIndex(targetIndex);
        }}
      />
    </div>
  );
};
