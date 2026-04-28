import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FastingTimerCard from '../../Components/FastingTimerCard';
import { PlanData } from '../../Data/PlanData';
import { FastingStatus } from '../../Types/FastingStatus';
import { Colors } from '../../Theme/colors';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'GÜNAYDIN';
  if (h < 18) return 'İYİ GÜNLER';
  return 'İYİ AKŞAMLAR';
}

const STATUS_TITLE: Record<FastingStatus, string> = {
  READY:   'Oruç bekleniyor',
  WAITING: 'Oruç planlandı',
  FASTING: 'Oruç sürüyor',
  DONE:    'Yeme vakti',
};

export default function HomeScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const plan = PlanData.find((p) => p.id === Number(planId ?? 0)) ?? PlanData[0];
const [fastingStatus, setFastingStatus] = useState<FastingStatus>('READY');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background }}>
      {/* Header */}
      <View className="flex-row items-start justify-between px-5 pt-3 pb-4">
        <View className="flex-1">
          {/* Greeting small caps */}
          <Text className="text-[11px] font-bold tracking-widest mb-0.5" style={{ color: Colors.headerAccent }}>
            {getGreeting()}, AYŞE
          </Text>
          {/* Dynamic title */}
          <Text className="text-[26px] font-bold mb-3" style={{ letterSpacing: -0.5, color: Colors.inkPrimary }}>
            {STATUS_TITLE[fastingStatus]}
          </Text>
          {/* Tags */}
          <View className="flex-row gap-2">
            {/* Plan + status tag */}
            <TouchableOpacity
              onPress={() => router.push('/(onboarding)/plan-select')}
              className="rounded-full px-3 py-1.5 bg-white"
              activeOpacity={0.7}
            >
              <Text className="text-[12px] font-semibold text-[#555]">
                {plan.label} · {
                  fastingStatus === 'FASTING' ? 'AKTİF'  :
                  fastingStatus === 'WAITING' ? 'BEKL.'  :
                  fastingStatus === 'DONE'    ? 'YEME'    :
                  'HAZIR'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar */}
        <TouchableOpacity
          className="w-11 h-11 rounded-full items-center justify-center mt-1"
          style={{ backgroundColor: Colors.avatarBg }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-bold" style={{ color: Colors.inkPrimary }}>A</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View className="flex-1 justify-center px-4 pb-4">
        <FastingTimerCard
          plan={plan}
          onStatusChange={setFastingStatus}
          showTestSlider
        />
      </View>
    </SafeAreaView>
  );
}