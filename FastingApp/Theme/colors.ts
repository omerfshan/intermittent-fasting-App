export const Colors = {
  background: '#F5F2EE',
  surface: '#FFFFFF',

  inkPrimary: '#1A1A1A',
  inkSecondary: '#888888',
  inkMuted: '#777777',

  actionPrimary: '#1A1A1A',
  actionPrimaryText: '#FFFFFF',

  success: '#4CAF50',
  border: '#EFEFEF',
  radioInactive: '#D5D5D5',

  // Timer card
  cardDefault: '#F5EDE0',   // READY state card background (cream)
  cardRing: '#E8E0D6',      // ring track color
  cardTick: '#D0C8BF',      // clock tick marks

  // Fasting active button
  fastingActive: '#F4956A',
  fastingActiveText: '#1A1A1A',

  // Header / avatar
  avatarBg: '#F2C4A8',
  headerAccent: '#5A8A50',  // "GÜNAYDIIN" small caps green
} as const;

// Onboarding slide backgrounds
export const OnboardingColors = {
  slide0Bg: '#C5DDD2',  // mint green
  slide1Bg: '#F2D4BC',  // peach
  slide2Bg: '#D8D4E8',  // lavender
  accent:   '#6A9E6A',  // sage green — PlanColorMap[0].accent ile aynı
} as const;

export interface PlanColors {
  accent: string;   // ring progress, label, dot
  badge: string;    // card background when FASTING (light tint)
}

export const PlanColorMap: Record<number, PlanColors> = {
  0: { accent: '#6A9E6A', badge: '#E4EEE5' }, // 16:8  – sage green
  1: { accent: '#E8845A', badge: '#FAEEE8' }, // 18:6  – terra cotta
  2: { accent: '#9B82D4', badge: '#EDE8F8' }, // 20:4  – lavender
  3: { accent: '#C9A83C', badge: '#FAF4DC' }, // OMAD  – amber
  4: { accent: '#A09080', badge: '#F0EBE4' }, // Özel  – warm gray
};

export const PlanBenefitMap: Record<number, string> = {
  0: 'SİNDİRİM',
  1: 'KETOZ',
  2: 'OTOFAJİ',
  3: 'KETON',
  4: 'ÖZEL',
};

export const getPlanColors = (id: number): PlanColors =>
  PlanColorMap[id] ?? { accent: '#AAAAAA', badge: '#F0F0F0' };
