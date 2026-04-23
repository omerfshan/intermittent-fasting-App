import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IPlan } from '../../Interface/IPlans';


interface PlanCardProps {
  plan: IPlan;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isSelected ? plan.badgeColor : '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderWidth: isSelected ? 1.5 : 1,
        borderColor: isSelected ? plan.accentColor : '#EFEFEF',
      }}
    >
      <PlanAvatar plan={plan} />
      <PlanInfo plan={plan} />
      <PlanRadio isSelected={isSelected} />
    </TouchableOpacity>
  );
};

// ─── Alt Parçalar ────────────────────────────────────────────

const PlanAvatar = ({ plan }: { plan: IPlan }) => (
  <View
    style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: plan.accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    }}
  >
    <Text
      style={{
        fontSize: plan.label.length > 3 ? 11 : 15,
        fontWeight: '700',
        color: '#3D3D3D',
        letterSpacing: -0.3,
      }}
    >
      {plan.label}
    </Text>
  </View>
);

const PlanInfo = ({ plan }: { plan: IPlan }) => (
  <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginRight: 6 }}>
        {plan.label}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: '600', color: '#888', letterSpacing: 0.5 }}>
        {plan.badge}
      </Text>
    </View>
    <Text style={{ fontSize: 13, color: '#777', lineHeight: 18 }}>
      {plan.description}
    </Text>
  </View>
);

const PlanRadio = ({ isSelected }: { isSelected: boolean }) => (
  <View
    style={{
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: isSelected ? 0 : 1.5,
      borderColor: '#D0D0D0',
      backgroundColor: isSelected ? '#1A1A1A' : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    }}
  >
    {isSelected && (
      <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '700' }}>✓</Text>
    )}
  </View>
);