import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

// Aynı sabit değerler FastingTimerCard ile birebir
const RING_SIZE = 280;
const STROKE_WIDTH = 10;
const DOT_R = 6;
const RADIUS = RING_SIZE / 2 - DOT_R - STROKE_WIDTH / 2 - 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CX = RING_SIZE / 2;
const CY = RING_SIZE / 2;
const INNER_RADIUS = RADIUS - STROKE_WIDTH / 2 - 2;

function polarToXY(progress: number) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return { x: CX + RADIUS * Math.cos(angle), y: CY + RADIUS * Math.sin(angle) };
}

interface Props {
  progress: number;
  accentColor: string;
  time: string;
}

export default function OnboardingClock({ progress, accentColor, time }: Props) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const endDot = progress > 0.005 ? polarToXY(progress) : null;

  return (
    <View style={{ width: RING_SIZE, height: RING_SIZE }}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        {/* Track — aynı renk FastingTimerCard fasting state */}
        <Circle
          cx={CX} cy={CY} r={RADIUS}
          stroke="#D8D8D8"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Progress arc */}
        <Circle
          cx={CX} cy={CY} r={RADIUS}
          stroke={accentColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${CX}, ${CY})`}
        />

        {/* White inner fill — track iç kenarına kadar uzatıldı, arkaplanın sızmaması için */}
        <Circle cx={CX} cy={CY} r={RADIUS - STROKE_WIDTH / 2 - 1} fill="#FFFFFF" />

        {/* Clock ticks — aynı FastingTimerCard */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
          const isMajor = i % 5 === 0;
          const outerR = INNER_RADIUS - 4;
          const innerR = outerR - (isMajor ? 10 : 5);
          return (
            <Line
              key={i}
              x1={CX + outerR * Math.cos(angle)} y1={CY + outerR * Math.sin(angle)}
              x2={CX + innerR * Math.cos(angle)} y2={CY + innerR * Math.sin(angle)}
              stroke="#C8C8C8"
              strokeWidth={isMajor ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Start dot — 12 o'clock */}
        <Circle cx={CX} cy={CY - RADIUS} r={DOT_R} fill={accentColor} />

        {/* End dot — arc tip */}
        {endDot && (
          <Circle cx={endDot.x} cy={endDot.y} r={DOT_R} fill={accentColor} />
        )}
      </Svg>

      {/* Center time — native Text için font kalitesi */}
      <View style={styles.centerOverlay} pointerEvents="none">
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
});
