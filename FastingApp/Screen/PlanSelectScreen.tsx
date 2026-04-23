import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F2EE' }}>
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

const Header = ({ onClose }: { onClose?: () => void }) => (
  <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
    <TouchableOpacity onPress={onClose} style={{ marginBottom: 12, width: 32 }}>
      <Text style={{ fontSize: 28, color: '#888', lineHeight: 32 }}>‹</Text>
    </TouchableOpacity>
    <Text style={{ fontSize: 11, fontWeight: '600', color: '#4CAF50', letterSpacing: 1.2, marginBottom: 4 }}>
      PROTOKOL
    </Text>
    <Text style={{ fontSize: 28, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, letterSpacing: -0.5 }}>
      Ritmin ne olsun?
    </Text>
    <Text style={{ fontSize: 14, color: '#888', lineHeight: 20 }}>
      {'İstediğin zaman değiştirebilirsin. Başlarken 16:8\ngenellikle en rahatıdır.'}
    </Text>
  </View>
);

const ConfirmButton = ({ onPress }: { onPress: () => void }) => (
  <View style={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 }}>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 18,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600', marginRight: 8 }}>
        Bu ritmi seç
      </Text>
      <Text style={{ color: '#FFF', fontSize: 16 }}>→</Text>
    </TouchableOpacity>
  </View>
);
