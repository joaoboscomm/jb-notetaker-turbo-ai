import { Theme } from '@/types';

export const COLORS = {
  background: '#FBF7F0',
  text: '#4A3B2C',
  border: '#8B7355',
  inputBg: '#F3EFE6',
};

export const THEMES: Record<string, Theme> = {
  orange: { 
    bg: '#F2B989', 
    border: '#C06626', 
    label: 'Orange' 
  },
  yellow: { 
    bg: '#F9E5A8', 
    border: '#D4AF37', 
    label: 'Yellow' 
  },
  green: { 
    bg: '#C8D5B9', 
    border: '#788F63', 
    label: 'Green' 
  },
  teal: { 
    bg: '#90B4B5', 
    border: '#4A7A7B', 
    label: 'Teal' 
  },
  peach: {
    bg: '#F5CBA7',
    border: '#D35400',
    label: 'Peach'
  },
  blue: {
    bg: '#AED6F1',
    border: '#2E86C1',
    label: 'Blue'
  },
  pink: {
    bg: '#F5B7B1',
    border: '#C0392B',
    label: 'Pink'
  }
};

export const IMAGES = {
  cat: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="110" r="60" fill="%23F4EBD0"/><path d="M60 80 L50 40 L90 70 Z" fill="%23F4EBD0"/><path d="M140 80 L150 40 L110 70 Z" fill="%23F4EBD0"/><path d="M60 80 L50 40 L90 70" stroke="%234A3B2C" stroke-width="3" fill="none"/><path d="M140 80 L150 40 L110 70" stroke="%234A3B2C" stroke-width="3" fill="none"/><circle cx="100" cy="110" r="60" stroke="%234A3B2C" stroke-width="3" fill="none"/><circle cx="80" cy="100" r="4" fill="%234A3B2C"/><circle cx="120" cy="100" r="4" fill="%234A3B2C"/><path d="M95 110 Q100 115 105 110" stroke="%234A3B2C" stroke-width="2" fill="none"/><path d="M50 110 L30 105" stroke="%234A3B2C" stroke-width="2"/><path d="M50 115 L30 118" stroke="%234A3B2C" stroke-width="2"/><path d="M150 110 L170 105" stroke="%234A3B2C" stroke-width="2"/><path d="M150 115 L170 118" stroke="%234A3B2C" stroke-width="2"/><path d="M130 160 Q170 160 180 140" stroke="%234A3B2C" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  cactus: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="70" y="130" width="60" height="40" rx="5" fill="%23D7B598" stroke="%234A3B2C" stroke-width="3"/><rect x="65" y="130" width="70" height="10" rx="2" fill="%23E6CBB3" stroke="%234A3B2C" stroke-width="3"/><path d="M80 130 L80 80 Q80 50 100 50 Q120 50 120 80 L120 130" fill="%23A3C1AD" stroke="%234A3B2C" stroke-width="3"/><path d="M120 90 Q140 80 140 70 Q140 60 130 80" stroke="%234A3B2C" stroke-width="3" fill="none"/><path d="M80 100 Q60 90 60 80 Q60 70 70 90" stroke="%234A3B2C" stroke-width="3" fill="none"/><circle cx="92" cy="90" r="3" fill="%234A3B2C"/><circle cx="108" cy="90" r="3" fill="%234A3B2C"/><path d="M96 98 Q100 102 104 98" stroke="%234A3B2C" stroke-width="2" fill="none"/><path d="M90 60 L90 70" stroke="%232E4033" stroke-width="2"/><path d="M110 60 L110 70" stroke="%232E4033" stroke-width="2"/><path d="M100 55 L100 65" stroke="%232E4033" stroke-width="2"/></svg>`,
  boba: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M70 170 L60 80 L140 80 L130 170 Q125 180 100 180 Q75 180 70 170" fill="%23F5CBA7" stroke="%234A3B2C" stroke-width="3"/><rect x="55" y="70" width="90" height="10" rx="2" fill="%235A4633" stroke="%234A3B2C" stroke-width="3"/><path d="M110 70 L130 30" stroke="%234A3B2C" stroke-width="8" stroke-linecap="round"/><circle cx="80" cy="160" r="5" fill="%234A3B2C"/><circle cx="100" cy="165" r="5" fill="%234A3B2C"/><circle cx="120" cy="160" r="5" fill="%234A3B2C"/><circle cx="90" cy="150" r="5" fill="%234A3B2C"/><circle cx="110" cy="150" r="5" fill="%234A3B2C"/><path d="M80 120 Q90 130 100 120 Q110 130 120 120" stroke="%234A3B2C" stroke-width="2" fill="none"/></svg>`
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
