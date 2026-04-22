import { IPlan } from "../Types/IPlans";

export const PlanData: IPlan[] = [
  {
    id: 0,
    label: '16:8',
    badge: 'BAŞLANGIÇ',
    description: '16 saat oruç, 8 saat yeme penceresi',
    accentColor: '#A8D5B5',
    badgeColor: '#E8F5E9',
  },
  {
    id: 1,
    label: '18:6',
    badge: 'ORTA SEVİYE',
    description: '18 saat oruç, 6 saat yeme penceresi',
    accentColor: '#F4A97F',
    badgeColor: '#FFF3ED',
  },
  {
    id: 2,
    label: '20:4',
    badge: 'SAVAŞÇI',
    description: '20 saat oruç, 4 saatlik yeme penceresi',
    accentColor: '#B8A4E8',
    badgeColor: '#F3EFFD',
  },
  
  {
    id: 3,
    label: 'Özel',
    badge: 'SEN BELİRLE',
    description: 'Kendi oruç süreni ve başlangıç saatini seç',
    accentColor: '#E8DFD0',
    badgeColor: '#F5F0E8',
  },
];