import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Project, CurveMode } from '../types';
import { playTick, playShutter } from '../services/audio';

interface SliderViewProps {
  projects: Project[];
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  onSelectProject: (project: Project) => void;
  fisheyeOn: boolean;
  curveMode?: CurveMode;
}

type DisplayProject = Project & { virtualKey: string; originalIndex: number };

const SliderCardMedia: React.FC<{
  project: DisplayProject;
  isActive: boolean;
  curveMode: string;
  fisheyeOn: boolean;
  isDragging: boolean;
}> = ({ project, isActive, curveMode, fisheyeOn, isDragging }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = Boolean(project.video) && (project.type === 'motion' || Boolean(project.video));

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    if (isHovered && !isDragging) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isDragging, isVideo]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image in Frame */}
      <img
        src={project.image}
        alt={project.alt}
        draggable={false}
        referrerPolicy="no-referrer"
        style={{
          filter:
            curveMode === 'cylinder' && isActive
              ? 'saturate(1.38) contrast(1.08) brightness(1.02)'
              : 'saturate(1) contrast(1) brightness(1)',
          transition: 'filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-500 ${
          fisheyeOn && isActive ? 'fisheye-optical' : ''
        } ${isVideo && isHovered && !isDragging ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video in Frame on hover */}
      {isVideo && project.video && (
        <video
          ref={videoRef}
          src={project.video}
          muted
          playsInline
          loop
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 ${
            isHovered && !isDragging ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export const SliderView: React.FC<SliderViewProps> = ({
  projects,
  currentIndex,
  setCurrentIndex,
  onSelectProject,
  fisheyeOn,
  curveMode = 'cylinder',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: -200, y: -200 });
  const tailPosRef = useRef({ x: -200, y: -200 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? (window.visualViewport?.width || window.innerWidth) : 1200,
    height: typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 800,
  }));
  const isMobile = windowSize.width < 768;
  const effectiveCurveMode: CurveMode = isMobile ? 'off' : curveMode;
  const effectiveFisheye = isMobile ? false : fisheyeOn;

  const [frameDimensions, setFrameDimensions] = useState(() => {
    if (typeof window !== 'undefined') {
      const w = window.visualViewport?.width || window.innerWidth;
      const h = window.visualViewport?.height || window.innerHeight;
      if (w < 768) {
        return {
          width: w,
          height: h,
          fisheyeSize: Math.min(w, h),
        };
      }
    }
    return { width: 395, height: 573, fisheyeSize: 840 };
  });
  const frameGap = isMobile ? 0 : (effectiveCurveMode === 'off' || effectiveFisheye ? 0 : 36);
  const step = frameDimensions.width + frameGap;

  // Smooth elastic trailing physics for the cursor tail
  useEffect(() => {
    let animId: number;
    const LERP = 0.12;

    const updateTail = () => {
      if (mousePosRef.current.x > 0) {
        // Offset so the badge trails behind and to the bottom-right as a tail, not centered on cursor
        const isNearRight = mousePosRef.current.x > window.innerWidth - 130;
        const isNearBottom = mousePosRef.current.y > window.innerHeight - 60;
        const offsetX = isNearRight ? -115 : 16;
        const offsetY = isNearBottom ? -36 : 16;

        const targetX = mousePosRef.current.x + offsetX;
        const targetY = mousePosRef.current.y + offsetY;

        tailPosRef.current.x += (targetX - tailPosRef.current.x) * LERP;
        tailPosRef.current.y += (targetY - tailPosRef.current.y) * LERP;

        if (followerRef.current) {
          followerRef.current.style.transform = `translate3d(${tailPosRef.current.x}px, ${tailPosRef.current.y}px, 0)`;
        }
      }
      animId = requestAnimationFrame(updateTail);
    };

    animId = requestAnimationFrame(updateTail);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Create a repeated virtual list for continuous, infinite conveyor belt scrolling
  const displayProjects = useMemo(() => {
    if (projects.length === 0) return [];
    const minCards = 24;
    const multiplier = Math.max(2, Math.ceil(minCards / projects.length));
    const repeated: (Project & { virtualKey: string; originalIndex: number })[] = [];
    for (let m = 0; m < multiplier; m++) {
      for (let i = 0; i < projects.length; i++) {
        repeated.push({
          ...projects[i],
          virtualKey: `${projects[i].id}-copy-${m}-${i}`,
          originalIndex: i,
        });
      }
    }
    return repeated;
  }, [projects]);

  const displayTotal = displayProjects.length;

  // Smooth continuous floating scroll position
  const [scrollPos, setScrollPos] = useState(0);
  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);
  const lastCenterRef = useRef(0);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Smooth curve mode switch transition state on desktop
  const [isCurveTransitioning, setIsCurveTransitioning] = useState(false);
  const [trackedMode, setTrackedMode] = useState(effectiveCurveMode);
  const [trackedFisheye, setTrackedFisheye] = useState(effectiveFisheye);
  const curveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronously catch mode changes during render so transition styles are present on the very first frame!
  if (trackedMode !== effectiveCurveMode || trackedFisheye !== effectiveFisheye) {
    setTrackedMode(effectiveCurveMode);
    setTrackedFisheye(effectiveFisheye);
    if (!isMobile) {
      setIsCurveTransitioning(true);
    }
  }

  useEffect(() => {
    if (isCurveTransitioning) {
      if (curveTimerRef.current) clearTimeout(curveTimerRef.current);
      curveTimerRef.current = setTimeout(() => {
        setIsCurveTransitioning(false);
      }, 1000);
    }
  }, [isCurveTransitioning]);

  // Continuous physics animation loop for liquid 60/120fps smooth momentum
  useEffect(() => {
    let animId: number;
    let lastTickTime = performance.now();
    let scrollVelocity = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTickTime) / 1000));
      lastTickTime = now;

      const delta = targetScrollRef.current - smoothScrollRef.current;
      const isMoving = Math.abs(delta) > 0.0001 || Math.abs(scrollVelocity) > 0.0001 || isDraggingRef.current;

      if (isMoving && displayTotal > 0) {
        if (isDraggingRef.current) {
          // Responsive tracking while dragging
          smoothScrollRef.current += delta * 0.14;
          scrollVelocity = 0;
        } else {
          // Second-order critically damped smooth spring:
          // Tuned for a moderately brisk, silky glide ("bit faster, but not too fast")
          const STIFFNESS = 32; // Responsive, brisk pull
          const DAMPING = 11.2; // Perfectly critically damped for a smooth, cushioned settle
          const springForce = delta * STIFFNESS;
          const dampingForce = scrollVelocity * DAMPING;
          const acceleration = springForce - dampingForce;

          scrollVelocity += acceleration * dt;
          smoothScrollRef.current += scrollVelocity * dt;

          // Snap to rest when settled
          if (Math.abs(delta) < 0.0002 && Math.abs(scrollVelocity) < 0.001) {
            smoothScrollRef.current = targetScrollRef.current;
            scrollVelocity = 0;
          }
        }

        // Wrap smooth bounds seamlessly
        if (smoothScrollRef.current >= displayTotal) {
          smoothScrollRef.current -= displayTotal;
          targetScrollRef.current -= displayTotal;
          startScrollRef.current -= displayTotal;
        } else if (smoothScrollRef.current < 0) {
          smoothScrollRef.current += displayTotal;
          targetScrollRef.current += displayTotal;
          startScrollRef.current += displayTotal;
        }

        setScrollPos(smoothScrollRef.current);

        // Check if active center frame has changed to sync audio tick & parent state
        const currentCenter = Math.round(smoothScrollRef.current);
        if (currentCenter !== lastCenterRef.current) {
          lastCenterRef.current = currentCenter;
          playTick();
          const wrappedIdx = ((currentCenter % displayTotal) + displayTotal) % displayTotal;
          const activeProj = displayProjects[wrappedIdx];
          if (activeProj && activeProj.originalIndex !== currentIndexRef.current) {
            setCurrentIndex(activeProj.originalIndex);
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [displayTotal, displayProjects, setCurrentIndex]);

  // Sync scroll position when external currentIndex or filtered projects change
  useEffect(() => {
    if (displayProjects.length === 0) return;
    const curWrappedIdx = ((Math.round(smoothScrollRef.current) % displayTotal) + displayTotal) % displayTotal;
    const currentVirtual = displayProjects[curWrappedIdx];
    if (!currentVirtual || currentVirtual.originalIndex !== currentIndex) {
      // Find nearest virtual item matching the requested originalIndex to minimize travel distance
      let bestDist = Infinity;
      let bestOffset = 0;
      displayProjects.forEach((item, idx) => {
        if (item.originalIndex === currentIndex) {
          let diff = (idx - smoothScrollRef.current) % displayTotal;
          if (diff > displayTotal / 2) diff -= displayTotal;
          if (diff < -displayTotal / 2) diff += displayTotal;
          if (Math.abs(diff) < bestDist) {
            bestDist = Math.abs(diff);
            bestOffset = diff;
          }
        }
      });
      targetScrollRef.current = Math.round(smoothScrollRef.current + bestOffset);
    }
  }, [currentIndex, displayProjects, displayTotal]);

  // Responsive frame size: full-screen on mobile, tall portrait frames on desktop
  useEffect(() => {
    const updateSize = () => {
      let w = typeof window !== 'undefined' ? (window.visualViewport?.width ?? window.innerWidth) : 1200;
      let h = typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 800;

      // Accurately measure the actual rendered layout space if containerRef is mounted
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          w = rect.width;
          h = rect.height;
        }
      }

      setWindowSize({ width: Math.round(w), height: Math.round(h) });

      if (w < 768) {
        setFrameDimensions({
          width: Math.round(w),
          height: Math.round(h),
          fisheyeSize: Math.round(Math.min(w, h)),
        });
      } else {
        const availableH = h - 210;
        const baseH = Math.max(availableH, 260);
        const finalH = baseH + 23;

        const targetW = Math.round(baseH * 0.72);
        const finalW = Math.min(targetW, Math.round(w * 0.85));

        const minDimension = Math.min(w, h);
        const fisheyeSize = Math.min(Math.round(minDimension * 0.96), 940);

        setFrameDimensions({
          width: Math.max(finalW, 220),
          height: Math.max(finalH, 283),
          fisheyeSize: Math.max(fisheyeSize, 280),
        });
      }
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    window.visualViewport?.addEventListener('resize', updateSize);
    window.visualViewport?.addEventListener('scroll', updateSize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        updateSize();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      window.visualViewport?.removeEventListener('resize', updateSize);
      window.visualViewport?.removeEventListener('scroll', updateSize);
      ro?.disconnect();
    };
  }, []);

  // 3D cylindrical radius scaled responsively to viewport width
  const radius = useMemo(() => {
    if (windowSize.width < 640) return 800;
    if (windowSize.width < 1024) return 1080;
    if (windowSize.width < 1600) return 1380;
    return 1650;
  }, [windowSize.width]);

  const goToNext = useCallback(() => {
    if (displayTotal === 0) return;
    targetScrollRef.current = Math.round(targetScrollRef.current) + 1;
  }, [displayTotal]);

  const goToPrev = useCallback(() => {
    if (displayTotal === 0) return;
    targetScrollRef.current = Math.round(targetScrollRef.current) - 1;
  }, [displayTotal]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCurveTransitioning) {
        setIsCurveTransitioning(false);
        if (curveTimerRef.current) clearTimeout(curveTimerRef.current);
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrev();
      } else if (e.key === 'Enter') {
        const centerIdx = ((Math.round(smoothScrollRef.current) % displayTotal) + displayTotal) % displayTotal;
        const activeProject = displayProjects[centerIdx];
        if (activeProject) {
          playShutter();
          onSelectProject(activeProject);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, displayProjects, displayTotal, onSelectProject, isCurveTransitioning]);

  // Wheel scroll gesture: deliberate strong scroll advances or retreats a whole image
  const wheelAccumulatorRef = useRef(0);
  const isWheelLockedRef = useRef(false);
  const wheelDecayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (displayTotal === 0) return;

      if (isCurveTransitioning) {
        setIsCurveTransitioning(false);
        if (curveTimerRef.current) clearTimeout(curveTimerRef.current);
      }

      // Normalize delta based on deltaMode (0: pixels, 1: lines, 2: pages)
      const rawDeltaX = e.deltaMode === 1 ? e.deltaX * 36 : e.deltaMode === 2 ? e.deltaX * 400 : e.deltaX;
      const rawDeltaY = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;

      // Determine predominant scroll delta with direction
      const dominantDelta = Math.abs(rawDeltaX) > Math.abs(rawDeltaY) ? rawDeltaX : rawDeltaY;

      // If wheel gesture is currently locked after sliding an image, extend unlock timer until scrolling stops
      if (isWheelLockedRef.current) {
        if (wheelUnlockTimerRef.current) clearTimeout(wheelUnlockTimerRef.current);
        wheelUnlockTimerRef.current = setTimeout(() => {
          isWheelLockedRef.current = false;
          wheelAccumulatorRef.current = 0;
        }, 340);
        return;
      }

      // Accumulate scroll input in the current stroke
      // If direction reverses mid-stroke, reset accumulator towards the new direction
      if (
        (wheelAccumulatorRef.current > 0 && dominantDelta < 0) ||
        (wheelAccumulatorRef.current < 0 && dominantDelta > 0)
      ) {
        wheelAccumulatorRef.current = dominantDelta;
      } else {
        wheelAccumulatorRef.current += dominantDelta;
      }

      // Reset accumulator if scrolling pauses or decays without reaching threshold
      if (wheelDecayTimerRef.current) clearTimeout(wheelDecayTimerRef.current);
      wheelDecayTimerRef.current = setTimeout(() => {
        wheelAccumulatorRef.current = 0;
      }, 180);

      // Strong scroll threshold: normal/small scrolls (< 60px) are ignored,
      // but a strong, deliberate scroll advances a whole image
      const STRONG_SCROLL_THRESHOLD = 60;

      if (Math.abs(wheelAccumulatorRef.current) >= STRONG_SCROLL_THRESHOLD) {
        isWheelLockedRef.current = true;
        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        wheelAccumulatorRef.current = 0;

        // Subtle micro-delay (70ms) before the slide launches
        // Keeps the weighted inertia feel while being noticeably crisper and faster
        if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current);
        scrollDelayTimerRef.current = setTimeout(() => {
          targetScrollRef.current = Math.round(targetScrollRef.current) + direction;
        }, 70);

        // Keep locked during gesture momentum so a single strong swipe moves exactly one image
        if (wheelUnlockTimerRef.current) clearTimeout(wheelUnlockTimerRef.current);
        wheelUnlockTimerRef.current = setTimeout(() => {
          isWheelLockedRef.current = false;
          wheelAccumulatorRef.current = 0;
        }, 420);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelDecayTimerRef.current) clearTimeout(wheelDecayTimerRef.current);
      if (wheelUnlockTimerRef.current) clearTimeout(wheelUnlockTimerRef.current);
      if (scrollDelayTimerRef.current) clearTimeout(scrollDelayTimerRef.current);
    };
  }, [displayTotal, isCurveTransitioning]);

  // Pointer drag handling: 1:1 direct tracking with momentum fling release
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const startYRef = useRef(0);
  const clickedCardRef = useRef<{ project: DisplayProject; startX: number; startY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.pointerType === 'touch') setIsTouchDevice(true);

    if (isCurveTransitioning) {
      setIsCurveTransitioning(false);
      if (curveTimerRef.current) clearTimeout(curveTimerRef.current);
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollRef.current = targetScrollRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') setIsTouchDevice(true);
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    if (tailPosRef.current.x < 0) {
      tailPosRef.current = { x: e.clientX + 16, y: e.clientY + 16 };
    }
    if (!isHoveringStage) setIsHoveringStage(true);

    if (!isDraggingRef.current || displayTotal === 0) return;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 8) {
      velocityRef.current = (e.clientX - lastXRef.current) / dt;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    }

    const diffX = e.clientX - startXRef.current;
    const diffY = e.clientY - startYRef.current;
    const dist = Math.hypot(diffX, diffY);
    if (dist > 8) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      try {
        if (!containerRef.current?.hasPointerCapture(e.pointerId)) {
          containerRef.current?.setPointerCapture(e.pointerId);
        }
      } catch {}
    }

    const curStep = effectiveFisheye ? 180 : step;
    targetScrollRef.current = startScrollRef.current - diffX / curStep;
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (e) {
      try {
        if (containerRef.current?.hasPointerCapture(e.pointerId)) {
          containerRef.current?.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }

    // Direct card tap or click selection
    if (!hasDraggedRef.current && clickedCardRef.current && e) {
      const dist = Math.hypot(
        e.clientX - clickedCardRef.current.startX,
        e.clientY - clickedCardRef.current.startY
      );
      if (dist < 12) {
        const card = clickedCardRef.current.project;
        playShutter();
        setCurrentIndex(card.originalIndex);
        onSelectProject(card);
        clickedCardRef.current = null;
        return;
      }
    }
    clickedCardRef.current = null;

    const curStep = effectiveFisheye ? 180 : step;
    // Cushioned fling momentum calculation
    const velocity = velocityRef.current; // px per ms
    const momentum = (velocity * 160) / curStep;
    targetScrollRef.current = Math.round(targetScrollRef.current - momentum);
  };

  if (projects.length === 0 || displayProjects.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
        NO WORKS MATCH FILTER
      </div>
    );
  }

  return (
    <div
      id="slider-stage"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') {
          mousePosRef.current = { x: e.clientX, y: e.clientY };
          if (tailPosRef.current.x < 0) {
            tailPosRef.current = { x: e.clientX + 16, y: e.clientY + 16 };
          }
          setIsHoveringStage(true);
        }
      }}
      onPointerLeave={() => {
        setIsHoveringStage(false);
      }}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
    >
      {/* Smooth Dark Backdrop when Fisheye is active */}
      <div
        className={`fixed inset-0 bg-black pointer-events-none z-10 transition-opacity duration-700 ease-out ${
          effectiveFisheye ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Authentic Circular Fisheye Vignette (covers whole screen, smoothly fades and scales in/out) */}
      <div
        className={`fisheye-vignette ${
          effectiveFisheye ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
        }`}
      />

      {/* Subtle Ambient Curved Stage Illumination */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700 ease-out"
        style={{
          opacity: effectiveCurveMode !== 'off' && !effectiveFisheye ? 0.7 : 0,
          background:
            'radial-gradient(ellipse 70% 35% at 50% 50%, rgba(37, 84, 242, 0.035) 0%, rgba(246, 244, 238, 0.012) 35%, transparent 70%)',
        }}
      />

      {/* 3D Perspective Stage for Curved Ribbon */}
      <div
        id="slider-3d-scene"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        style={{
          perspective: '1250px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          id="slider-3d-track"
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {displayProjects.map((project, idx) => {
            // Smooth circular continuous offset around scrollPos
            let continuousOffset = (idx - scrollPos) % displayTotal;
            if (continuousOffset > displayTotal / 2) continuousOffset -= displayTotal;
            if (continuousOffset < -displayTotal / 2) continuousOffset += displayTotal;

            const isActive = Math.abs(continuousOffset) < 0.48;

            // Frames up to 8.5 steps away during curve transition on desktop, 7.0 normally, 2.5 on mobile are rendered
            const isFarOffscreen = isMobile
              ? Math.abs(continuousOffset) > 2.5
              : Math.abs(continuousOffset) > (isCurveTransitioning ? 8.5 : 7.0);
            if (isFarOffscreen) return null;

            const width = effectiveFisheye && isActive
              ? frameDimensions.fisheyeSize
              : frameDimensions.width;
            const height = effectiveFisheye && isActive ? frameDimensions.fisheyeSize : frameDimensions.height;

            let targetX = 0;
            let targetY = 0;
            let targetZ = 0;
            let rotY = 0;
            let rotZ = 0;
            let scale = 1;

            if (effectiveFisheye) {
              if (isActive) {
                targetX = continuousOffset * (step * 0.35);
                scale = 1;
              } else {
                targetX = continuousOffset * (step + 280);
                scale = 0.85;
                targetZ = -220;
              }
            } else if (effectiveCurveMode === 'arch') {
              // Fanned Arch / Rainbow Bridge mode matching user reference screenshot
              const archThetaStep = 9.8 * (Math.PI / 180);
              const angleRad = continuousOffset * archThetaStep;
              const angleDeg = continuousOffset * 9.8;
              const archRadius = Math.max(1500, (step * 0.98) / Math.sin(archThetaStep));

              targetX = archRadius * Math.sin(angleRad);
              targetY = archRadius * (1 - Math.cos(angleRad)) - 32;
              targetZ = -Math.abs(continuousOffset) * 22;
              rotZ = angleDeg;
              rotY = -continuousOffset * 3.5;
              scale = 1 - Math.min(0.08, Math.abs(continuousOffset) * 0.022);
            } else if (effectiveCurveMode === 'arc') {
              // Concave Panoramic Ribbon: sides curve backward into depth and face toward center
              const baseAngleStep = Math.min(0.30, Math.max(0.18, step / radius));
              const sign = Math.sign(continuousOffset);
              const abs = Math.abs(continuousOffset);
              // Soft compression on outer frames for a cinema-grade panoramic wrap
              const taperedOffset = sign * (abs <= 2.5 ? abs : 2.5 + Math.pow(abs - 2.5, 0.72));
              const angleRad = taperedOffset * baseAngleStep;
              const angleDeg = angleRad * (180 / Math.PI);

              targetX = radius * Math.sin(angleRad);
              targetZ = radius * (Math.cos(angleRad) - 1);
              rotY = -angleDeg;
              rotZ = 0;
              targetY = 0;
            } else if (effectiveCurveMode === 'cylinder') {
              // Convex Cylinder Carousel: sides wrap around outward cylinder drum
              const baseAngleStep = Math.min(0.28, Math.max(0.18, step / radius));
              const sign = Math.sign(continuousOffset);
              const abs = Math.abs(continuousOffset);
              const taperedOffset = sign * (abs <= 2.5 ? abs : 2.5 + Math.pow(abs - 2.5, 0.72));
              const angleRad = taperedOffset * baseAngleStep;
              const angleDeg = angleRad * (180 / Math.PI);

              const centerProminence = Math.max(0, 1 - Math.abs(continuousOffset));

              targetX = radius * Math.sin(angleRad);
              // Elevate the center card forward and push sides into depth so the center card stays cleanly in front without clipping
              targetZ =
                -radius * (1 - Math.cos(angleRad)) * 1.05 -
                Math.abs(taperedOffset) * 28 +
                centerProminence * 85;
              rotY = angleDeg * 0.85;
              rotZ = 0;
              targetY = 0;
              scale = 1 - Math.min(0.06, Math.abs(continuousOffset) * 0.015);
            } else {
              // Flat linear conveyor
              targetX = continuousOffset * step;
              targetZ = 0;
              rotY = 0;
              rotZ = 0;
            }

            const opacity = effectiveFisheye ? (isActive ? 1 : 0) : 1;
            const pointerEvents = effectiveFisheye ? (isActive ? 'auto' : 'none') : 'auto';
            const zIndex = isMobile
              ? isActive
                ? 30
                : Math.max(1, 20 - Math.round(Math.abs(continuousOffset)))
              : Math.max(1, 100 - Math.round(Math.abs(continuousOffset) * 6));

            return (
              <div
                key={project.virtualKey}
                id={`frame-card-${project.virtualKey}`}
                onPointerDown={(e) => {
                  if (e.button !== 0 && e.pointerType === 'mouse') return;
                  clickedCardRef.current = { project, startX: e.clientX, startY: e.clientY };
                }}
                onPointerUp={(e) => {
                  if (e.button !== 0 && e.pointerType === 'mouse') return;
                  if (
                    clickedCardRef.current &&
                    clickedCardRef.current.project.virtualKey === project.virtualKey
                  ) {
                    const dist = Math.hypot(
                      e.clientX - clickedCardRef.current.startX,
                      e.clientY - clickedCardRef.current.startY
                    );
                    if (dist < 10) {
                      playShutter();
                      setCurrentIndex(project.originalIndex);
                      onSelectProject(project);
                      clickedCardRef.current = null;
                    }
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playShutter();
                  setCurrentIndex(project.originalIndex);
                  onSelectProject(project);
                }}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  marginLeft: `-${width / 2}px`,
                  marginTop: `-${height / 2}px`,
                  transform: `translate3d(${targetX}px, ${targetY}px, ${targetZ}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  zIndex,
                  opacity,
                  pointerEvents,
                  boxShadow:
                    isMobile || effectiveCurveMode === 'off'
                      ? '0 0 0 0 rgba(0,0,0,0)'
                      : isActive
                      ? '0 25px 60px -15px rgba(0,0,0,0.95)'
                      : effectiveCurveMode === 'arch'
                      ? '0 20px 45px -10px rgba(0,0,0,0.85)'
                      : '0 15px 35px -10px rgba(0,0,0,0.85)',
                  transition:
                    isCurveTransitioning && !isDragging
                      ? 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), width 0.8s cubic-bezier(0.16, 1, 0.3, 1), height 0.8s cubic-bezier(0.16, 1, 0.3, 1), margin 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.95s cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1), height 0.7s cubic-bezier(0.16, 1, 0.3, 1), margin 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                }}
                className={`select-none overflow-hidden cursor-pointer rounded-none ${
                  isMobile
                    ? 'filter-none'
                    : isActive
                    ? 'filter-none'
                    : effectiveCurveMode === 'arch'
                    ? 'filter grayscale contrast-90 brightness-90 hover:brightness-100'
                    : 'filter grayscale contrast-90 brightness-90'
                }`}
              >
                {/* Media in Frame (plays on hover for video) */}
                <SliderCardMedia
                  project={project}
                  isActive={isActive}
                  curveMode={effectiveCurveMode}
                  fisheyeOn={effectiveFisheye}
                  isDragging={isDragging}
                />

                {/* Mobile Overlapped Project Name & Info (hidden on desktop, finely balanced vertical offset) */}
                <div className="md:hidden absolute bottom-0 inset-x-0 z-30 pointer-events-none pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2.5rem))] pt-32 px-6 bg-gradient-to-t from-black/95 via-black/55 to-transparent flex flex-col items-start justify-end">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#fcf8ef] leading-tight drop-shadow-md">
                    {project.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {project.client && (
                      <span className="text-xs text-[#c7c4bd] font-mono tracking-wide uppercase">
                        {project.client}
                      </span>
                    )}
                    {project.client && project.tag && (
                      <span className="text-xs text-[#737373] font-mono">•</span>
                    )}
                    {project.tag && (
                      <span className="text-xs text-[#c7c4bd] font-mono tracking-wide uppercase">
                        {project.tag}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3D Mode Framing Border Overlay - smoothly fades out to zero in off mode so it never affects content sizing */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-900 ease-out"
                  style={{
                    border: '1px solid',
                    borderColor:
                      isActive
                        ? 'rgba(255, 255, 255, 0.15)'
                        : effectiveCurveMode === 'arch'
                        ? 'rgba(255, 255, 255, 0.10)'
                        : 'rgba(255, 255, 255, 0.05)',
                    opacity: isMobile || effectiveCurveMode === 'off' ? 0 : 1,
                  }}
                />

                {/* 3D Atmospheric Depth Shading Overlay across curve (used for arc/cylinder) */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-900 ease-out"
                  style={{
                    background:
                      continuousOffset > 0.05
                        ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 100%)'
                        : continuousOffset < -0.05
                        ? 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.6) 100%)'
                        : 'none',
                    opacity:
                      isMobile || isActive || effectiveCurveMode === 'off' || effectiveCurveMode === 'arch' || effectiveFisheye
                        ? 0
                        : Math.min(0.68, Math.pow(Math.abs(continuousOffset) / 3.2, 1.2) * 0.72),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Delayed Mouse Tail "View project" Badge portaled directly to document.body so pointer distance is 100% identical in both normal and fisheye modes */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={followerRef}
            id="cursor-tail-view-project"
            className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform select-none hidden md:block"
            style={{
              transform: 'translate3d(-300px, -300px, 0)',
              opacity: isHoveringStage && !isDragging && !isTouchDevice ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div className="corner-box-sm px-2.5 py-1 flex items-center justify-center bg-[#111111]/90 backdrop-blur-md shadow-xl border border-white/10">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-white uppercase font-mono whitespace-nowrap">
                View project
              </span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
