import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewMode, Project, CurveMode } from './types';
import { PROJECTS } from './data/projects';
import { Header } from './components/Header';
import { SliderView } from './components/SliderView';
import { ListView } from './components/ListView';
import { ProjectLightbox } from './components/ProjectLightbox';
import { StillGalleryModal } from './components/StillGalleryModal';
import { FullscreenVideoModal } from './components/FullscreenVideoModal';
import { StudioModal } from './components/StudioModal';
import { ContactModal } from './components/ContactModal';
import { SoundIntro } from './components/SoundIntro';
import { Footer } from './components/Footer';
import { loadSoundAssets, setSoundEnabled } from './services/audio';
import { getImageRGB } from './services/colorExtractor';
import { AmbientBackdrop } from './components/AmbientBackdrop';

export default function App() {
  const [showSoundIntro, setShowSoundIntro] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [gesturesOn, setGesturesOn] = useState(true);
  const [fisheyeOn, setFisheyeOn] = useState(false);
  const [curveMode, setCurveMode] = useState<CurveMode>('arc');
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Preload sound on startup
  useEffect(() => {
    loadSoundAssets().catch(() => {});
  }, []);

  const filteredProjects = PROJECTS;

  const currentProject = filteredProjects[currentIndex] || filteredProjects[0] || null;

  // Extract dim color for the project currently at the center
  const centerRGB = useMemo(() => {
    return getImageRGB(currentProject?.image, currentProject?.slug);
  }, [currentProject]);

  // Next & previous project navigation inside lightbox
  const currentProjectIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex((p) => p.id === selectedProject.id);
  }, [selectedProject, filteredProjects]);

  const handleNextProject = () => {
    if (currentProjectIndex === -1) return;
    const nextIdx = (currentProjectIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  const handlePrevProject = () => {
    if (currentProjectIndex === -1) return;
    const prevIdx = (currentProjectIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIdx]);
  };

  const handleSoundIntroDismiss = (withSound: boolean) => {
    setSoundOn(withSound);
    setSoundEnabled(withSound);
    setShowSoundIntro(false);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden text-[#f6f4ee] select-none flex flex-col justify-between selection:bg-[#2554f2] selection:text-white">
      {/* Silky-smooth Dual-Layer Ambient Backdrop */}
      <AmbientBackdrop rgb={centerRGB} mode="dark" duration={900} />

      {/* Sound Entry Gatekeeper */}
      {showSoundIntro && <SoundIntro onEnter={handleSoundIntroDismiss} />}

      {/* Top Minimal Chrome Navigation */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Stage — STRICTLY SQUARE FRAMES */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {viewMode === 'slider' && (
          <SliderView
            projects={filteredProjects}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onSelectProject={(proj) => setSelectedProject(proj)}
            fisheyeOn={fisheyeOn}
            curveMode={curveMode}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            projects={filteredProjects}
            onSelectProject={(proj) => setSelectedProject(proj)}
            currentIndex={currentIndex}
            onHoverIndex={setCurrentIndex}
          />
        )}
      </main>

      {/* Bottom Minimal Chrome: Brand + Fisheye | Project Title & Meta | Sound & Ruler Ticker */}
      <Footer
        currentProject={currentProject}
        projects={filteredProjects}
        currentIndex={currentIndex}
        onSelectIndex={setCurrentIndex}
        fisheyeOn={fisheyeOn}
        setFisheyeOn={setFisheyeOn}
        curveMode={curveMode}
        setCurveMode={setCurveMode}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        gesturesOn={gesturesOn}
        setGesturesOn={setGesturesOn}
      />

      {/* Image Detailed Slide Screen (for stills) / Smooth Fullscreen Video Modal (for videos) */}
      <AnimatePresence>
        {selectedProject && (selectedProject.type === 'motion' || Boolean(selectedProject.video)) && (
          <FullscreenVideoModal
            key={`video-${selectedProject.id}`}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
            totalProjectsCount={PROJECTS.length}
          />
        )}

        {selectedProject && selectedProject.type !== 'motion' && !selectedProject.video && (
          <StillGalleryModal
            key={`stills-${selectedProject.id}`}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
            gesturesOn={gesturesOn}
            setGesturesOn={setGesturesOn}
            totalProjectsCount={PROJECTS.length}
          />
        )}
      </AnimatePresence>

      {/* Studio / About Modal */}
      <StudioModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Contact Page Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
