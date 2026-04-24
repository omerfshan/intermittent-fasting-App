import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { onboardingSlides } from '../Data/onboardingData';
import { OnboardingColors } from '../Theme/colors';
import OnboardingSlide from '../Components/onboarding/OnboardingSlide';

// API'den geldiğinde bu map buradan kaldırılır
const SLIDE_COLORS: Record<number, { backgroundColor: string; accentColor: string }> = {
  0: { backgroundColor: OnboardingColors.slide0Bg, accentColor: OnboardingColors.accent },
  1: { backgroundColor: OnboardingColors.slide1Bg, accentColor: OnboardingColors.accent },
  2: { backgroundColor: OnboardingColors.slide2Bg, accentColor: OnboardingColors.accent },
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToApp = () => router.replace('/(tabs)');

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      goToApp();
    }
  };

  const slide = onboardingSlides[currentIndex];
  const colors = SLIDE_COLORS[currentIndex];

  return (
    <OnboardingSlide
      slide={slide}
      backgroundColor={colors.backgroundColor}
      accentColor={colors.accentColor}
      totalSlides={onboardingSlides.length}
      onNext={handleNext}
      onSkip={goToApp}
    />
  );
}
