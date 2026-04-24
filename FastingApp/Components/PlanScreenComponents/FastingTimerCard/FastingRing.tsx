import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

// Sabitler buraya ya da ayrı bir constants.ts'e taşınabilir
const RING_SIZE = 280;
const STROKE_WIDTH = 10;
const DOT_R = 6;
const RADIUS = RING_SIZE / 2 - DOT_R - STROKE_WIDTH / 2 - 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CX = RING_SIZE / 2;
const CY = RING_SIZE / 2;
const INNER_RADIUS = RADIUS - STROKE_WIDTH / 2 - 2;

function ClockTicks({ color }: { color: string }) {
  return (
    <>
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
            stroke={color} strokeWidth={isMajor ? 2 : 1} strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

interface Props {
  progress: number;
  isFasting: boolean;
  ringTrack: string;
  ringColor: string;
  tickColor: string;
  accentColor: string;
}

export function FastingRing({ progress, isFasting, ringTrack, ringColor, tickColor, accentColor }: Props) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const endpoint = isFasting && progress > 0.005 ? (() => {
    const angle = progress * 2 * Math.PI - Math.PI / 2;
    return { x: CX + RADIUS * Math.cos(angle), y: CY + RADIUS * Math.sin(angle) };
  })() : null;

  return (
    <Svg width={RING_SIZE} height={RING_SIZE}>
      <Circle cx={CX} cy={CY} r={RADIUS} stroke={ringTrack} strokeWidth={STROKE_WIDTH} fill="none" />
      {isFasting && (
        <Circle
          cx={CX} cy={CY} r={RADIUS}
          stroke={ringColor} strokeWidth={STROKE_WIDTH} fill="none"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${CX}, ${CY})`}
        />
      )}
      <Circle cx={CX} cy={CY} r={INNER_RADIUS - 6} fill="#FFFFFF" />
      <ClockTicks color={tickColor} />
      {isFasting && <Circle cx={CX} cy={CY - RADIUS} r={DOT_R} fill={accentColor} />}
      {endpoint && <Circle cx={endpoint.x} cy={endpoint.y} r={DOT_R} fill={accentColor} />}
    </Svg>
  );
}