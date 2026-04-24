import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  label: string;
  time: string;
  hint: string;
  accentColor: string;
}

export function FastingCenterText({ label, time, hint, accentColor }: Props) {
  return (
    <View className="absolute items-center px-8" pointerEvents="none">
      <Text className="text-[11px] font-bold tracking-widest mb-1" style={{ color: accentColor }}>
        {label}
      </Text>
      <Text className="font-black text-[#1A1A1A]" style={{ fontSize: 42, letterSpacing: -1 }}>
        {time}
      </Text>
      <Text className="text-[12px] text-[#999] mt-1 text-center">{hint}</Text>
    </View>
  );
}