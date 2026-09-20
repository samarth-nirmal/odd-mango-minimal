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
  'vans-sandton-opening': { r: 164, g: 110, b: 64 }, // skate oak / warm amber
  'totalsports-womens-race': { r: 218, g: 56, b: 112 }, // vibrant magenta / hot pink
  'netflix-comic-con-cpt': { r: 48, g: 96, b: 175 }, // neon cyan / comic-con blue
  'o-studioza': { r: 115, g: 100, b: 88 }, // concrete neutral / editorial
  'new-balance-2002r': { r: 138, g: 132, b: 120 }, // technical mesh slate
  'crocs-x-sportscene': { r: 210, g: 135, b: 45 }, // playful bright orange
  'johnnie-walker-afro-exchange': { r: 182, g: 124, b: 52 }, // rich whisky gold
  'kylablac': { r: 72, g: 112, b: 154 }, // rooftop sky & denim blue
  'braam-fashion-week': { r: 168, g: 78, b: 58 }, // urban terracotta
  'trinidad-james': { r: 162, g: 52, b: 68 }, // burgundy & gold
  'maybelline-africa': { r: 198, g: 68, b: 98 }, // cosmetic berry / rose
  'instax-in-alexandra': { r: 142, g: 102, b: 72 }, // sepia documentary warmth
  'curtissy-li-king-billius': { r: 84, g: 76, b: 138 }, // royal indigo / violet
  'puma-slipstream': { r: 38, g: 156, b: 138 }, // electric mint / teal
  'red-bull-tetris': { r: 196, g: 42, b: 58 }, // arcade scarlet
  'red-bull-kunye-records': { r: 172, g: 68, b: 92 }, // afro-house sunset
  'glenfiddich-experience': { r: 44, g: 96, b: 64 }, // highland forest green
  'slaps-reel': { r: 52, g: 82, b: 134 }, // cinematic midnight navy
  'studio88-adidasza': { r: 56, g: 106, b: 164 }, // cobalt sportswear
  'be-an-all-star': { r: 168, g: 54, b: 62 }, // vintage red
  'nedbank-polo': { r: 54, g: 118, b: 76 }, // emerald turf & champagne
};

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
