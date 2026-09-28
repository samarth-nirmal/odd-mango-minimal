import imageColorsData from '../data/imageColors.json';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Pre-computed image color map directly extracted from image pixel data
export const IMAGE_COLORS: Record<string, RGB> = imageColorsData as Record<string, RGB>;

// Curated project-level vibrant tones for instant zero-latency transitions
export const PROJECT_COLOR_PRESETS: Record<string, RGB> = {
  'loop': { r: 60, g: 75, b: 110 },
  'cine-sanskriti-tour': { r: 180, g: 110, b: 50 },
  'ocean-muse': { r: 40, g: 110, b: 160 },
  'ashiana-amodh': { r: 160, g: 130, b: 80 },
  'restraunt-tour-reel': { r: 180, g: 80, b: 50 },
  'loop-motion': { r: 60, g: 75, b: 110 },

/**
 * Retrieves the dominant RGB of an image URL, checking exact matches first,
 * then project slug fallback, then default neutral.
 */
export function getImageRGB(imageUrl?: string, projectSlug?: string): RGB {
  if (imageUrl && IMAGE_COLORS[imageUrl]) {
    return IMAGE_COLORS[imageUrl];
  }

  // Check if any key starts with this base URL (ignoring query params)
  if (imageUrl) {
    const base = imageUrl.split('?')[0];
    for (const [key, val] of Object.entries(IMAGE_COLORS)) {
      if (key.startsWith(base)) return val;
    }
  }

  if (projectSlug && PROJECT_COLOR_PRESETS[projectSlug]) {
    return PROJECT_COLOR_PRESETS[projectSlug];
  }

  return { r: 70, g: 70, b: 75 };
}

/**
 * Generates a dim, atmospheric background style for dark canvases (App.tsx / SliderView).
 * Blends a subtle amount of the image's color into dark charcoal with a gentle radial bloom.
 */
export function getDimDarkStyle(rgb: RGB): { backgroundColor: string; background: string } {
  // Boost color vibrance slightly so the dim tone feels genuinely connected to the image
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  
  // Saturated boost
  let rBoost = rgb.r;
  let gBoost = rgb.g;
  let bBoost = rgb.b;
  if (delta > 10) {
    const factor = 1.35;
    rBoost = Math.min(255, Math.round(rgb.r * factor));
    gBoost = Math.min(255, Math.round(rgb.g * factor));
    bBoost = Math.min(255, Math.round(rgb.b * factor));
  }

  // Base dim background: 15% image color mixed with #101010
  const bgR = Math.round(14 + rBoost * 0.16);
  const bgG = Math.round(14 + gBoost * 0.16);
  const bgB = Math.round(14 + bBoost * 0.16);
  const baseBg = `rgb(${bgR}, ${bgG}, ${bgB})`;

  return {
    backgroundColor: baseBg,
    background: `radial-gradient(ellipse 85% 75% at 50% 50%, rgba(${rBoost}, ${gBoost}, ${bBoost}, 0.24) 0%, rgba(${rBoost}, ${gBoost}, ${bBoost}, 0.08) 55%, ${baseBg} 100%)`,
  };
}

/**
 * Generates a dim, atmospheric background style for light/gallery canvases (StillGalleryModal).
 * Blends a delicate wash of the image's color into an off-white background with a soft ambient bloom.
 */
export function getDimLightStyle(rgb: RGB): { backgroundColor: string; background: string } {
  // Boost color vibrance slightly so the tint is distinct and clear
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  
  let rBoost = rgb.r;
  let gBoost = rgb.g;
  let bBoost = rgb.b;
  if (delta > 10) {
    const factor = 1.35;
    rBoost = Math.min(255, Math.round(rgb.r * factor));
    gBoost = Math.min(255, Math.round(rgb.g * factor));
    bBoost = Math.min(255, Math.round(rgb.b * factor));
  }

  // Base dim background: soft 14% tint over #fcfcfc
  const lightR = Math.round(255 - (255 - rBoost) * 0.16);
  const lightG = Math.round(255 - (255 - gBoost) * 0.16);
  const lightB = Math.round(255 - (255 - bBoost) * 0.16);
  const baseBg = `rgb(${lightR}, ${lightG}, ${lightB})`;

  return {
    backgroundColor: baseBg,
    background: `radial-gradient(ellipse 90% 80% at 50% 50%, rgba(${rBoost}, ${gBoost}, ${bBoost}, 0.18) 0%, rgba(${rBoost}, ${gBoost}, ${bBoost}, 0.05) 60%, ${baseBg} 100%)`,
  };
}
