import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../../Theme/colors';
import { FastingStatus } from '../../../Types/FastingStatus';

interface Props {
  status: FastingStatus;
  onPress: () => void;
}

export function FastingButton({ status, onPress }: Props) {
  const buttonBg =
    status === 'READY' ? Colors.fastingDeactive :
    status === 'WAITING' ? '#5A5A5A' :
    Colors.fastingActive;

  const buttonTextColor =
    status === 'READY' ? Colors.fastingDeactiveText :
    status === 'WAITING' ? '#FFFFFF' :
    Colors.fastingActiveText;

  const buttonLabel =
    status === 'READY' ? 'Orucu başlat' :
    status === 'WAITING' ? 'Planı iptal et' :
    status === 'FASTING' ? 'Orucu bitir' :
    'Yeni oruç';

  const iconName =
    status === 'READY' ? 'play' :
    status === 'WAITING' ? 'close-circle-outline' :
    status === 'FASTING' ? 'pause' :
    'refresh';

  return (
    <TouchableOpacity
      className="rounded-full py-[17px] w-full items-center"
      style={{ backgroundColor: buttonBg }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="flex-row items-center gap-2.5">
        <Ionicons name={iconName} size={18} color={buttonTextColor} />

        <Text
          className="text-base font-semibold tracking-wide"
          style={{ color: buttonTextColor }}
        >
          {buttonLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}