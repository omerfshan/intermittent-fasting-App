import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { IPlan } from '../Interface/IPlans';
import { PlanData } from '../Data/PlanData';
import { PlanList } from '../Components/PlanScreenComponents/PlanList';


interface PlanSelectScreenProps {
  onClose?: () => void;
  onConfirm?: (plan: IPlan) => void;
}

export default function PlanSelectScreen({ onClose, onConfirm }: PlanSelectScreenProps) {
  const [selectedId, setSelectedId] = useState<number>(0);

  const selectedPlan = PlanData.find((p) => p.id === selectedId)!;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F2EE]">
      <StatusBar barStyle="dark-content" />

      <Header onClose={onClose} />

      <PlanList
        plans={PlanData}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <ConfirmButton onPress={() => onConfirm?.(selectedPlan)} />
    </SafeAreaView>
  );
}

// ─── Alt Parçalar ────────────────────────────────────────────

const Header = ({ onClose }: { onClose?: () => void }) => (
  <View className="px-5 pt-4 pb-2">
    <TouchableOpacity onPress={onClose} className="mb-3 w-8">
      <Text className="text-2xl text-gray-500">‹</Text>
    </TouchableOpacity>
    <Text className="text-xs font-semibold tracking-widest text-green-600 mb-1">
      PROTOKOL
    </Text>
    <Text className="text-3xl font-bold text-[#1A1A1A] mb-2">
      Ritmin ne olsun?
    </Text>
    <Text className="text-sm text-gray-500 leading-5">
      İstediğin zaman değiştirebilirsin. Başlarken 16:8{'\n'}genellikle en rahatıdır.
    </Text>
  </View>
);

const ConfirmButton = ({ onPress }: { onPress: () => void }) => (
  <View className="px-5 pb-6 pt-3">
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-[#1A1A1A] rounded-2xl py-4 items-center flex-row justify-center"
    >
      <Text className="text-white text-base font-semibold mr-2">Bu ritmi seç</Text>
      <Text className="text-white text-base">→</Text>
    </TouchableOpacity>
  </View>
);