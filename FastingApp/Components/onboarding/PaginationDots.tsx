import React from 'react';
import { View } from 'react-native';

interface Props {
  total: number;
  current: number;
}

export default function PaginationDots({ total, current }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 22 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === current ? '#1A1A1A' : '#C8C8C8',
          }}
        />
      ))}
    </View>
  );
}
