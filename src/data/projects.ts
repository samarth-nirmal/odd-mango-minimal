import { Project, StudioInfo } from '../types';

export const STUDIO_INFO: StudioInfo = {
  title: 'ODD MANGO',
  tagline: 'documenting emotion, movement and meaning.',
  bio: 'A boutique production studio with unyielding passion for storytelling. Photography and film documenting emotion, movement and meaning — for brands and culture.',
  since: '2016',
  location: 'Johannesburg, South Africa',
  email: 'hello@oddmango.com',
  instagram: '@oddmango',
  services: [
    'Commercial Photography',
    'Film Production & Direction',
    'Fashion & Editorial',
    'Brand Campaigns',
    'Events & Cultural Moments',
    'Art Direction & Color Grading'
  ],
  trustedClients: [
    { name: 'Aston Martin', slug: 'aston-martin', category: 'Automotive' },
    { name: 'Vans', slug: 'vans', category: 'Skate & Street' },
    { name: 'Under Armour', slug: 'under-armour', category: 'Performance' },
    { name: 'Nike', slug: 'nike', category: 'Sportswear' },
    { name: 'Adidas', slug: 'adidas', category: 'Sportswear' },
    { name: 'Puma', slug: 'puma', category: 'Sportswear' },
    { name: 'Netflix', slug: 'netflix', category: 'Entertainment' },
    { name: 'Red Bull', slug: 'redbull', category: 'Beverage & Culture' },
    { name: 'Crocs', slug: 'crocs', category: 'Footwear' },
    { name: 'New Balance', slug: 'new-balance', category: 'Footwear' },
    { name: 'Glenfiddich', slug: 'glenfiddich', category: 'Luxury Spirits' },
    { name: 'Johnnie Walker', slug: 'johnnie-walker', category: 'Luxury Spirits' },
    { name: 'Maybelline', slug: 'maybelline', category: 'Beauty' },
    { name: 'Fujifilm', slug: 'fujifilm', category: 'Imaging' }
  ]
};

export interface TeamMember {
  name: string;
  role: string;
  email: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Marco Santos',
    role: 'Founder & Creative Director',
    email: 'marco@oddmango.com'
  },
  {
    name: 'Sarah Chen',
    role: 'Executive Producer',
    email: 'sarah@oddmango.com'
  }
];

const assetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

export const PROJECTS: Project[] = [
  // 1. Vans Sandton Opening (Default active match screenshot)
  {
    id: '1',
    slug: 'vans-sandton-opening',
    name: 'Vans Sandton Opening',
    client: 'Vans',
    type: 'stills',
    tag: 'events',
    count: 6,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/798dee7ace344c1cb63b8d8b5287a2627a2b44aa-1440x1800.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/798dee7ace344c1cb63b8d8b5287a2627a2b44aa-1440x1800.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/204b116420aafd30655204fccfddf6b460e7ea9d-1080x1350.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/1841bd2b18a75f8407fa9d6310523603b7346275-1440x1800.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/2ca7959c9ac480711c8451d92598c7205bb63a96-1080x1350.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Vans Sandton Opening event showcasing skate culture and youth community in Johannesburg',
    description: 'Documenting the authentic skate subculture and launch night celebration for Vans Sandton flagship.',
    meta: {
      camera: 'Contax G2',
      lens: 'Biogon 28mm f/2.8',
      aperture: 'f/5.6',
      shutter: '1/125s',
      iso: 'Kodak Portra 400',
      year: '2023',
      location: 'Sandton City'
    }
  },
  // 2. TotalSports Women's Race
  {
    id: '2',
    slug: 'totalsports-womens-race',
    name: "TotalSports Women's Race",
    client: 'Nike',
    type: 'stills',
    tag: 'events',
    count: 18,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/c120cf8bd6c9d7cc3f7653bf77db5a6c6fedb4a5-1440x1440.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/19bdd4f785713a3f87cda95c3bc6aa5c0c21e2a2-1440x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/c120cf8bd6c9d7cc3f7653bf77db5a6c6fedb4a5-1440x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/df80cf45747652b97b2d2668d5330326a268ebd5-1440x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/e1a733375dc151915e809b44af957343533ace76-1440x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/d965fc015df7396b55f137101959f7d5e58949e7-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/79117e3cc0ee0d2d7d0d19e1ec72a8ec83279ece-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/4346ffe216983e9bfa80672b88310ccdc61de43d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/5f16f6b214df286e1f05fbfb46b4c5440d1dd64d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/84d15ccc9d69a8f20eea4e48e108d931b240bfd0-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: "Athletes running through Johannesburg during the TotalSports Women's Race",
    description: 'A celebration of sisterhood, endurance and urban velocity through the streets of Johannesburg.',
    meta: {
      camera: 'Leica M11',
      lens: 'Summicron-M 35mm f/2 ASPH',
      aperture: 'f/2.8',
      shutter: '1/1000s',
      iso: '100',
      year: '2023',
      location: 'Johannesburg CBD'
    }
  },
  // 3. Netflix @ Comic Con CPT
  {
    id: '3',
    slug: 'netflix-comic-con-cpt',
    name: 'Netflix @ Comic Con CPT',
    client: 'Netflix',
    type: 'stills',
    tag: 'events',
    count: 14,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/4414578b77d61184ff565d778d9b1513bf365022-1080x1439.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/4414578b77d61184ff565d778d9b1513bf365022-1080x1439.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/f8931a742c3175ba8f074d00845a7b6294ae07eb-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/816ef83307fc8b4c09dbe9146dfd8c1c4f526017-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Cosplay, fandom and immersive brand installation for Netflix at Comic Con Cape Town',
    description: 'Dynamic character portraits and subculture electricity at Cape Town International Convention Centre.',
    meta: {
      camera: 'Sony A1',
      lens: 'FE 50mm f/1.2 GM',
      aperture: 'f/1.4',
      shutter: '1/500s',
      iso: '400',
      year: '2024',
      location: 'CTICC Cape Town'
    }
  },
  // 4. O_StudioZA
  {
    id: '4',
    slug: 'o-studioza',
    name: 'O_StudioZA',
    client: 'Adidas',
    type: 'stills',
    tag: 'editorial',
    count: 12,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/bbefec89895ff455ec363574c8bc465d63f2fe00-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/bbefec89895ff455ec363574c8bc465d63f2fe00-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/49ecbb734f24c2fc9fc56ec694a9aee894ae4a81-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/ae903b14bf69caef7ef8adf613e428cd60463707-1080x1439.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Streetwear, creative expression and collective identity for O_StudioZA',
    description: 'Raw, unvarnished documentation of emerging South African creative collectives and fashion designers.',
    meta: {
      camera: 'Hasselblad 503CW',
      lens: 'Carl Zeiss Planar 80mm f/2.8',
      aperture: 'f/4.0',
      shutter: '1/250s',
      iso: 'Ilford HP5 Plus 400',
      year: '2023',
      location: 'Johannesburg Underground'
    }
  },
  // 5. New Balance 2002R
  {
    id: '5',
    slug: 'new-balance-2002r',
    name: 'New Balance 2002R',
    client: 'New Balance',
    type: 'stills',
    tag: 'campaign',
    count: 15,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/694b82a3e919f1adc22eeb7b13aacbf17400ea9f-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/694b82a3e919f1adc22eeb7b13aacbf17400ea9f-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/695ba06ccda33626f559f92296024fbaddb3eb67-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/adf2d4aa85426538eb27dbac34bffc3e05fc7d55-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Tactile macro product and lifestyle campaign for New Balance 2002R',
    description: 'Deconstructed aesthetics, technical mesh, and raw concrete backdrop highlighting artisanal footwear design.',
    meta: {
      camera: 'Leica SL2-S',
      lens: 'APO-Summicron-SL 50mm f/2 ASPH',
      aperture: 'f/4.0',
      shutter: '1/400s',
      iso: '160',
      year: '2024',
      location: 'Braamfontein'
    }
  },
  // 6. Crocs x Sportscene
  {
    id: '6',
    slug: 'crocs-x-sportscene',
    name: 'Crocs x Sportscene',
    client: 'Crocs',
    type: 'stills',
    tag: 'commercial',
    count: 15,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/752ad4c585ea27c44e5b451bb3e97f5df595aaf0-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/752ad4c585ea27c44e5b451bb3e97f5df595aaf0-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/964d9c2c0d51ee1278cfcf41e77e649e75f1d64a-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/00433100b6e1b33e70afbd160022423bff9123f1-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Playful customized footwear and vibrant set design for Crocs x Sportscene campaign',
    description: 'Expressive personality and personalized Jibbitz culture rendered through vivid primary hues.',
    meta: {
      camera: 'Leica M11',
      lens: 'Apo-Summicron-M 50mm f/2',
      aperture: 'f/4.0',
      shutter: '1/500s',
      iso: '125',
      year: '2024',
      location: 'Sportscene Studios'
    }
  },
  // 7. Johnnie Walker Afro Exchange
  {
    id: '7',
    slug: 'johnnie-walker-afro-exchange',
    name: 'Johnnie Walker Afro Exchange',
    client: 'Johnnie Walker',
    type: 'stills',
    tag: 'campaign',
    count: 24,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/ab5f64f9329fa9ce1b4fdf90403cc63a2b8cb3ba-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/ab5f64f9329fa9ce1b4fdf90403cc63a2b8cb3ba-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/4f839bb8316dfc1caf0d0a6180cfbe6d0815a318-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Nightlife, luxury tasting and Pan-African sound innovators with Johnnie Walker',
    description: 'Celebrating Pan-African creative pioneers across music, fashion, and culinary excellence.',
    meta: {
      camera: 'Sony FX3',
      lens: 'FE 35mm f/1.4 GM',
      aperture: 'f/1.8',
      shutter: '1/200s',
      iso: '1250',
      year: '2023',
      location: 'The Vault, Sandhurst'
    }
  },
  // 8. kylablac
  {
    id: '8',
    slug: 'kylablac',
    name: 'kylablac',
    client: 'kylablac',
    type: 'stills',
    tag: 'editorial',
    count: 23,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/e9cd88b87efbd3ae73769a001c55e4f7eb2048a3-975x1300.webp?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/e9cd88b87efbd3ae73769a001c55e4f7eb2048a3-975x1300.webp?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/5e63fdbb350490b3ec25d75531f5d3e207a01b13-1080x1439.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Portrait of a woman in cap and denim crouching on rooftop under blue Johannesburg sky',
    description: 'An intimate natural-light portrait study capturing subtle nuances of stillness, gaze, and urban elevation.',
    meta: {
      camera: 'Leica M11',
      lens: 'Noctilux-M 50mm f/0.95 ASPH',
      aperture: 'f/1.2',
      shutter: '1/2000s',
      iso: '64',
      year: '2024',
      location: 'Braamfontein Rooftop'
    }
  },
  // 9. Braam Fashion Week
  {
    id: '9',
    slug: 'braam-fashion-week',
    name: 'Braam Fashion Week',
    client: 'SAFW',
    type: 'stills',
    tag: 'editorial',
    count: 16,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/84d15ccc9d69a8f20eea4e48e108d931b240bfd0-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/84d15ccc9d69a8f20eea4e48e108d931b240bfd0-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/79117e3cc0ee0d2d7d0d19e1ec72a8ec83279ece-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'High street fashion and raw runway energy at Braamfontein Fashion Week',
    description: 'South African fashion innovators redefining couture through decolonial aesthetics and bold silhouettes.',
    meta: {
      camera: 'Fujifilm GFX 100 II',
      lens: 'GF 110mm f/2 R LM WR',
      aperture: 'f/2.8',
      shutter: '1/800s',
      iso: '400',
      year: '2023',
      location: 'Braamfontein Alleyways'
    }
  },
  // 10. Trinidad James
  {
    id: '10',
    slug: 'trinidad-james',
    name: 'Trinidad James',
    client: 'Trinidad James',
    type: 'stills',
    tag: 'personal',
    count: 14,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/aa5b942d1541c4c07a7fadb91da43e2813b21625-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/aa5b942d1541c4c07a7fadb91da43e2813b21625-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/56aa6a6e505aeff3ca35f6e96c12ff8eb23e96d1-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Candid portraiture with hip-hop artist Trinidad James during Johannesburg studio stopover',
    description: 'Intimate backstage documentation blending eccentric jewellery styling with authentic portrait expressions.',
    meta: {
      camera: 'Leica M11 Monochrom',
      lens: 'Summilux-M 35mm f/1.4',
      aperture: 'f/1.4',
      shutter: '1/250s',
      iso: '800',
      year: '2023',
      location: 'Klipspruit, Soweto'
    }
  },
  // 11. Maybelline Africa
  {
    id: '11',
    slug: 'maybelline-africa',
    name: 'Maybelline Africa',
    client: 'Maybelline',
    type: 'stills',
    tag: 'commercial',
    count: 12,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/5f16f6b214df286e1f05fbfb46b4c5440d1dd64d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/5f16f6b214df286e1f05fbfb46b4c5440d1dd64d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/4c524f99ce690b4bbec3e8d699f2006913c78ff6-1080x1439.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'High-definition editorial beauty imagery for Maybelline New York Africa launch',
    description: 'Celebrating melanin-rich skin textures, luminescent pigment and bold contemporary beauty.',
    meta: {
      camera: 'Phase One IQ4 150MP',
      lens: 'Schneider Kreuznach 120mm LS f/4 Macro',
      aperture: 'f/8.0',
      shutter: '1/1600s',
      iso: '50',
      year: '2024',
      location: 'Rosebank'
    }
  },
  // 12. Instax in Alexandra
  {
    id: '12',
    slug: 'instax-in-alexandra',
    name: 'Instax in Alexandra',
    client: 'Fujifilm',
    type: 'stills',
    tag: 'personal',
    count: 19,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/d965fc015df7396b55f137101959f7d5e58949e7-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/d965fc015df7396b55f137101959f7d5e58949e7-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/491f9ada0767d61990b439df1a705781abb0a9e5-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Community memories and instant film workshops in Alexandra township',
    description: 'Gifting instant tactile prints directly to township youth and families across Alexandra.',
    meta: {
      camera: 'Fujifilm Instax Wide 300 & GFX 50R',
      lens: 'GF 45mm f/2.8',
      aperture: 'f/4.0',
      shutter: '1/500s',
      iso: '400',
      year: '2023',
      location: 'Alexandra, Gauteng'
    }
  },
  // 13. Curtissy Li & King Billius
  {
    id: '13',
    slug: 'curtissy-li-king-billius',
    name: 'Curtissy Li & King Billius',
    client: 'King Billius',
    type: 'stills',
    tag: 'editorial',
    count: 11,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/4346ffe216983e9bfa80672b88310ccdc61de43d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/4346ffe216983e9bfa80672b88310ccdc61de43d-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80',
      'https://cdn.sanity.io/images/ayo3ha0v/production/ec74a14c303b8df8964a66ee658788ff877bb28c-1080x1440.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Experimental styling and avant-garde jewellery portraits',
    description: 'Sculptural metallic accessories and boundary-pushing avant-garde fashion documentation.',
    meta: {
      camera: 'Leica SL2',
      lens: 'Vario-Elmarit-SL 24-90mm f/2.8-4',
      aperture: 'f/3.5',
      shutter: '1/250s',
      iso: '200',
      year: '2024',
      location: 'Newtown'
    }
  },

  // MOTION (8 projects)
  // 14. Puma Slipstream
  {
    id: '14',
    slug: 'puma-slipstream',
    name: 'Puma Slipstream',
    client: 'Puma',
    type: 'motion',
    tag: 'campaign',
    count: 20,
    duration: 48,
    image: 'https://image.mux.com/V01CbaLfS33rSWoMYvgJSud4WkOMXDxFF5CmFyBOSjAM/thumbnail.webp?time=9&width=1200',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://image.mux.com/V01CbaLfS33rSWoMYvgJSud4WkOMXDxFF5CmFyBOSjAM/thumbnail.webp?time=9&width=1200',
      assetUrl('images/carousel-3.webp')
    ],
    alt: 'Puma Slipstream sneaker campaign showcasing urban dance and retro styling',
    description: 'A nostalgic homage to 80s basketball heritage remixed for contemporary street style in Maboneng.',
    meta: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'Cooke Anamorphic /i 40mm',
      aperture: 'T2.3',
      shutter: '1/48s',
      iso: '800',
      year: '2023',
      location: 'Maboneng Precinct'
    }
  },
  // 15. Red bull x Tetris
  {
    id: '15',
    slug: 'red-bull-tetris',
    name: 'Red bull x Tetris',
    client: 'Red Bull',
    type: 'motion',
    tag: 'events',
    count: 14,
    duration: 35,
    image: 'https://image.mux.com/7b32Z4f2N01Y45M7vP9k9XvN6g01wQ3m/thumbnail.webp?time=4&width=1200',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://image.mux.com/7b32Z4f2N01Y45M7vP9k9XvN6g01wQ3m/thumbnail.webp?time=4&width=1200',
      assetUrl('images/carousel-2.webp')
    ],
    alt: 'High octane gaming tournament and arcade lights for Red Bull x Tetris',
    description: 'Fast-paced editing capturing competitive esports tension, retro visuals and laser displays.',
    meta: {
      camera: 'Sony FX6',
      lens: 'Sony GM 24-70mm f/2.8',
      aperture: 'f/2.8',
      shutter: '1/50s',
      iso: '1600',
      year: '2023',
      location: 'Kyalami Theatre'
    }
  },
  // 16. Red bull x KUNYE Records
  {
    id: '16',
    slug: 'red-bull-kunye-records',
    name: 'Red bull x KUNYE Records',
    client: 'Red Bull',
    type: 'motion',
    tag: 'events',
    count: 16,
    duration: 62,
    image: 'https://image.mux.com/Kq2u3d4N6k9XvM7vP9k9XvN6g01wQ3m/thumbnail.webp?time=12&width=1200',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://image.mux.com/Kq2u3d4N6k9XvM7vP9k9XvN6g01wQ3m/thumbnail.webp?time=12&width=1200'
    ],
    alt: 'Afro-house music festival and crowd euphoria curated by Shimza and Kunye',
    description: 'Deep resonant house rhythms and sonic vibration connecting thousands of dancers at sunset.',
    meta: {
      camera: 'RED Komodo 6K',
      lens: 'Canon Cine-Servo 17-120mm',
      aperture: 'T2.95',
      shutter: '1/48s',
      iso: '800',
      year: '2023',
      location: 'Huddle Park, Linksfield'
    }
  },
  // 17. Glenfiddich Experience
  {
    id: '17',
    slug: 'glenfiddich-experience',
    name: 'Glenfiddich Experience',
    client: 'Aston Martin',
    type: 'motion',
    tag: 'events',
    count: 12,
    duration: 71,
    image: 'https://image.mux.com/9IOm1pHI016vef02G5oK1EDn80100Qx7ZlKKh0159MKdhiz8/thumbnail.webp?time=8&width=1200',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://image.mux.com/9IOm1pHI016vef02G5oK1EDn80100Qx7ZlKKh0159MKdhiz8/thumbnail.webp?time=8&width=1200',
      assetUrl('images/carousel-4.webp')
    ],
    alt: 'Luxury scotch tasting paired with Aston Martin supercar dynamics',
    description: 'Precision engineering meets heritage distilling in an evening of high-performance elegance.',
    meta: {
      camera: 'RED V-Raptor 8K VV',
      lens: 'Leitz Hugo 50mm T1.5',
      aperture: 'T2.0',
      shutter: '1/48s',
      iso: '800',
      year: '2024',
      location: 'Kyalami Grand Prix Circuit'
    }
  },
  // 18. Slaps Reel
  {
    id: '18',
    slug: 'slaps-reel',
    name: 'Slaps Reel',
    client: 'Slaps Sando',
    type: 'motion',
    tag: 'commercial',
    count: 9,
    duration: 18,
    image: 'https://image.mux.com/sZFHyiJqiCTe02PVrjeeDBXy8R4nMgHcDjxDRWDXEBtw/thumbnail.webp?time=19&width=1200',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://image.mux.com/sZFHyiJqiCTe02PVrjeeDBXy8R4nMgHcDjxDRWDXEBtw/thumbnail.webp?time=19&width=1200'
    ],
    alt: 'Fast-cut culinary motion sizzle reel for artisanal sandwich shop',
    description: 'High-speed macro cinematography capturing sizzling textures and mouthwatering craft.',
    meta: {
      camera: 'Phantom Flex4K',
      lens: 'Laowa 24mm T14 2X PeriProbe',
      aperture: 'T14',
      shutter: '1/2000s (1000fps)',
      iso: '1600',
      year: '2024',
      location: 'Parkhurst'
    }
  },
  // 19. @studio88_branded x @adidasza
  {
    id: '19',
    slug: 'studio88-adidasza',
    name: '@studio88_branded x @adidasza',
    client: 'Adidas',
    type: 'motion',
    tag: 'campaign',
    count: 10,
    duration: 40,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/49ecbb734f24c2fc9fc56ec694a9aee894ae4a81-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/49ecbb734f24c2fc9fc56ec694a9aee894ae4a81-1440x1919.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Originals apparel campaign with Studio 88 across urban Joburg rail yards',
    description: 'Classic three-stripe silhouette documentation capturing youth freedom and city pace.',
    meta: {
      camera: 'ARRI Amira',
      lens: 'Zeiss Super Speed 25mm T1.3',
      aperture: 'T2.0',
      shutter: '1/48s',
      iso: '800',
      year: '2023',
      location: 'Doornfontein'
    }
  },
  // 20. Be An All Star
  {
    id: '20',
    slug: 'be-an-all-star',
    name: 'Be An All Star',
    client: 'Converse',
    type: 'motion',
    tag: 'campaign',
    count: 15,
    duration: 52,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/f88e65524f09f382c8177a6803356d462dc9b4d2-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/f88e65524f09f382c8177a6803356d462dc9b4d2-1125x2000.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'Grassroots basketball and skate culture documentary in Soweto',
    description: 'Raw cement courts, bouncing basketballs, and the timeless Chuck Taylor aesthetic.',
    meta: {
      camera: 'Sony FX9',
      lens: 'Fujinon MK 18-55mm T2.9',
      aperture: 'T2.9',
      shutter: '1/50s',
      iso: '800',
      year: '2024',
      location: 'Diepkloof, Soweto'
    }
  },
  // 21. Nedbank Polo
  {
    id: '21',
    slug: 'nedbank-polo',
    name: 'Nedbank Polo',
    client: 'Nedbank',
    type: 'motion',
    tag: 'events',
    count: 8,
    duration: 45,
    image: 'https://cdn.sanity.io/images/ayo3ha0v/production/2ca7959c9ac480711c8451d92598c7205bb63a96-1080x1350.jpg?w=1600&fit=max&fm=webp&q=80',
    video: assetUrl('videos/sample.mp4'),
    gallery: [
      'https://cdn.sanity.io/images/ayo3ha0v/production/2ca7959c9ac480711c8451d92598c7205bb63a96-1080x1350.jpg?w=1600&fit=max&fm=webp&q=80'
    ],
    alt: 'High society equestrian sport, haute couture and champagne at Inanda Club',
    description: 'High goal polo action, thoroughbred galloping and glamorous equestrian styling.',
    meta: {
      camera: 'Sony A1',
      lens: 'FE 400mm f/2.8 GM OSS',
      aperture: 'f/2.8',
      shutter: '1/2000s',
      iso: '200',
      year: '2023',
      location: 'Inanda Club, Sandton'
    }
  }
];
