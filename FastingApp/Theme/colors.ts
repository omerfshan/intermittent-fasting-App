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
} as const;

export interface PlanColors {
  accent: string;
  badge: string;
}

export const PlanColorMap: Record<number, PlanColors> = {
  0: { accent: '#A8D5B5', badge: '#E8F5E9' }, // 16:8
  1: { accent: '#F4A97F', badge: '#FFF3ED' }, // 18:6
  2: { accent: '#B8A4E8', badge: '#F3EFFD' }, // 20:4
  3: { accent: '#F4D76F', badge: '#FFFBEA' }, // OMAD
  4: { accent: '#E8DFD0', badge: '#F5F0E8' }, // Özel
};

export const getPlanColors = (id: number): PlanColors =>
  PlanColorMap[id] ?? { accent: '#CCCCCC', badge: '#F5F5F5' };
