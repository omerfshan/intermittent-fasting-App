import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  time: string;
  dayLabel: string;
}

export function InfoCard({ title, time, dayLabel }: Props) {
  return (
    <View className="flex-1 bg-white rounded-2xl px-4 py-4">
      <Text className="text-[10px] font-semibold tracking-widest text-[#BBBBBB] mb-2">{title}</Text>
      <Text className="text-2xl font-bold text-[#1A1A1A]">{time}</Text>
      <Text className="text-xs text-[#AAAAAA] mt-0.5">{dayLabel}</Text>
    </View>
  );
}