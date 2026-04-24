export interface OnboardingSlide {
  id: number;
  clockTime: string;
  clockProgress: number;
  label: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 0,
    clockTime: '08:42',
    clockProgress: 0.27,
    label: 'MERHABA',
    title: 'Oruç tutmak artık çok daha kolay.',
    description:
      'Dairesel sayaç seninle birlikte ilerlesin. Her saniyeyi hissedecek, bitişe ne kadar kaldığını bir bakışta göreceksin.',
  },
  {
    id: 1,
    clockTime: '00:12',
    clockProgress: 0.58,
    label: 'SANA UYGUN PROTOKOL',
    title: '16:8, 18:6 veya\nkendi ritmin.',
    description:
      'Bir protokol seç ya da kendi saatlerini belirle. Seni dinler, uyarır ve hazır olduğunda bildirir.',
  },
  {
    id: 2,
    clockTime: '00:12',
    clockProgress: 0.83,
    label: 'İLERLEMENİ GÖR',
    title: 'Küçük zaferler,\nbüyük değişim.',
    description:
      'Ağırlık, enerji ve ruh halini tek dokunuşla kaydet. Haftalar içinde ne kadar yol aldığını gör.',
    isLast: true,
  },
];
