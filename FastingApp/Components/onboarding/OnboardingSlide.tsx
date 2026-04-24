import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingSlide as SlideData } from '../../Data/onboardingData';
import OnboardingClock from './OnboardingClock';
import PaginationDots from './PaginationDots';

interface Props {
  slide: SlideData;
  backgroundColor: string;
  accentColor: string;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingSlide({
  slide,
  backgroundColor,
  accentColor,
  totalSlides,
  onNext,
  onSkip,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor }]}>
      {/* Skip */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7} hitSlop={12}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
      </View>

      {/* Clock */}
      <View style={styles.clockWrapper}>
        <OnboardingClock
          progress={slide.clockProgress}
          accentColor={accentColor}
          time={slide.clockTime}
        />
      </View>

      {/* Card */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.label}>{slide.label}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        <View style={styles.nav}>
          <PaginationDots total={totalSlides} current={slide.id} />
          <TouchableOpacity onPress={onNext} style={styles.nextButton} activeOpacity={0.85}>
            <Text style={styles.nextText}>
              {slide.isLast ? 'Haydi başlayalım' : 'Devam et'} →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  clockWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#AAAAAA',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Georgia',
    color: '#1A1A1A',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 22,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  nextButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 50,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
