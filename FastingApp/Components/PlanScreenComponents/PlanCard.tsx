import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IPlan } from '../../Interface/IPlans';
import { getPlanColors } from '../../Theme/colors';

interface PlanCardProps {
  plan: IPlan;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  const colors = getPlanColors(plan.id);

  return (
    <TouchableOpacity
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isSelected ? colors.badge : '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderWidth: isSelected ? 1.5 : 0,
        borderColor: isSelected ? colors.accent : 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0 : 0.07,
        shadowRadius: 6,
        elevation: isSelected ? 0 : 2,
      }}
    >
      <PlanAvatar label={plan.label} accentColor={colors.accent} />
      <PlanInfo plan={plan} />
      <PlanRadio isSelected={isSelected} />
    </TouchableOpacity>
  );
};

const avatarLabel = (label: string) =>
  label.includes(':') ? label.split(':')[0] : label;

const PlanAvatar = ({ label, accentColor }: { label: string; accentColor: string }) => (
  <View
    style={{
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    }}
  >
    <Text
      style={{
        fontSize: avatarLabel(label).length > 3 ? 11 : 16,
        fontWeight: '700',
        color: '#3D3D3D',
        letterSpacing: -0.3,
      }}
    >
      {avatarLabel(label)}
    </Text>
  </View>
);

const PlanInfo = ({ plan }: { plan: IPlan }) => (
  <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginRight: 6 }}>
        {plan.label}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: '600', color: '#999', letterSpacing: 0.6 }}>
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
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: isSelected ? 0 : 1.5,
      borderColor: '#D5D5D5',
      backgroundColor: isSelected ? '#1A1A1A' : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    }}
  >
    {isSelected && (
      <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800', marginTop: -1 }}>✓</Text>
    )}
  </View>
);
