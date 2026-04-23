import { IPlan } from "../Interface/IPlans";

export const PlanData: IPlan[] = [
  { id: 0, label: '16:8',  badge: 'BAŞLANGIÇ',  description: '16 saat oruç, 8 saat yeme penceresi' },
  { id: 1, label: '18:6',  badge: 'ORTA SEVİYE', description: '18 saat oruç, 6 saat yeme penceresi' },
  { id: 2, label: '20:4',  badge: 'SAVAŞÇI',     description: '20 saat oruç, 4 saatlik yeme penceresi' },
  { id: 3, label: 'OMAD',  badge: 'İLERİ',        description: 'Günde tek öğün, 1 saatlik yeme penceresi' },
  { id: 4, label: 'Özel',  badge: 'SEN BELİRLE',  description: 'Kendi oruç süreni ve başlangıç saatini seç' },
];
