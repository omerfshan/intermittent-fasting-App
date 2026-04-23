import React from 'react';
import { ScrollView } from 'react-native';
import { PlanCard } from './PlanCard';
import { IPlan } from '../../Interface/IPlans';

interface PlanListProps {
  plans: IPlan[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export const PlanList = ({ plans, selectedId, onSelect }: PlanListProps) => {
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
    >
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedId === plan.id}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
};
