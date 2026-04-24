import React, { useRef } from 'react';
import { View, Text, PanResponder } from 'react-native';
import { Colors } from '../../../Theme/colors';


function pad(n: number) { return String(n).padStart(2, '0'); }
function formatHMS(s: number) {
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

interface Props {
  elapsedSeconds: number;
  goalSeconds: number;
  progress: number;
  accentColor: string;
  onSlide: (value: number) => void;
}

export function TestSlider({ elapsedSeconds, goalSeconds, progress, accentColor, onSlide }: Props) {
  const trackWidthRef = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        onSlide(Math.round(ratio * goalSeconds));
      },
      onPanResponderMove: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        onSlide(Math.round(ratio * goalSeconds));
      },
    })
  ).current;

  return (
    <View className="bg-white rounded-2xl px-4 py-4 gap-2">
      <Text className="text-[10px] font-semibold tracking-widest text-[#BBBBBB]">
        TEST · {formatHMS(elapsedSeconds)} / {formatHMS(goalSeconds)}
      </Text>

      <View
        className="h-8 justify-center"
        onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        {/* Track */}
        <View className="w-full h-1.5 rounded-full" style={{ backgroundColor: Colors.cardRing }}>
          <View
            className="h-1.5 rounded-full"
            style={{ width: `${progress * 100}%`, backgroundColor: accentColor }}
          />
        </View>

        {/* Thumb */}
        <View
          className="absolute w-5 h-5 rounded-full border-2 border-white"
          style={{
            left: `${progress * 100}%`,
            marginLeft: -10,
            backgroundColor: accentColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}
        />
      </View>
    </View>
  );
}