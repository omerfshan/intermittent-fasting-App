import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import { Colors } from '../../../Theme/colors';
import { FastingStatus } from '../../../Types/FastingStatus';

interface Props {
  status: FastingStatus;
        onPress:()=>void;
}

export function FastingButton({ status, onPress }: Props) {
  const buttonBg = status === 'READY' ? Colors.fastingDeactive: Colors.fastingActive;
  const buttonTextColor = status === 'READY' ? Colors.fastingDeactiveText : Colors.fastingActiveText;
  const buttonLabel = status === 'READY' ? 'Orucu başlat' : status === 'FASTING' ? 'Orucu bitir' : 'Yeni oruç';

  return (
    <TouchableOpacity
      className="rounded-full py-[17px] w-full items-center"
      style={{ backgroundColor: buttonBg }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center gap-2.5">
        {status === 'READY' && (
          <View style={{ width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderLeftWidth: 13,
            borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: buttonTextColor }} />
        )}
        {status === 'FASTING' && (
          <View className="flex-row gap-1">
            <View className="w-1 h-[18px] rounded-sm" style={{ backgroundColor: buttonTextColor }} />
            <View className="w-1 h-[18px] rounded-sm" style={{ backgroundColor: buttonTextColor }} />
          </View>
        )}
        {status === 'DONE' && (
          <Text className="text-base font-semibold" style={{ color: buttonTextColor }}>↺</Text>
        )}
        <Text className="text-base font-semibold tracking-wide" style={{ color: buttonTextColor }}>
          {buttonLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}