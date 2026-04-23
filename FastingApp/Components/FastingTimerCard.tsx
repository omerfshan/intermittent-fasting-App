import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, PanResponder } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { IPlan } from '../Interface/IPlans';
import { Colors, getPlanColors } from '../Theme/colors';

export type FastingStatus = 'READY' | 'FASTING' | 'DONE';

interface Props {
  plan: IPlan;
  customHours?: number;
  onStatusChange?: (status: FastingStatus) => void;
  showTestSlider?: boolean;
}

const RING_SIZE = 280;
const STROKE_WIDTH = 10;
const DOT_R = 6;
// Padding so dots don't get clipped: dot radius + stroke half + margin
const RADIUS = RING_SIZE / 2 - DOT_R - STROKE_WIDTH / 2 - 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CX = RING_SIZE / 2;
const CY = RING_SIZE / 2;
const INNER_RADIUS = RADIUS - STROKE_WIDTH / 2 - 2;

function getPlanHours(label: string, customHours = 16): number {
  const match = label.match(/^(\d+):/);
  if (match) return parseInt(match[1], 10);
  if (label === 'OMAD') return 23;
  return customHours;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Bugün';
  if (date.toDateString() === yesterday.toDateString()) return 'Dün';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function getEndpointXY(progress: number) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return { x: CX + RADIUS * Math.cos(angle), y: CY + RADIUS * Math.sin(angle) };
}

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

export default function FastingTimerCard({ plan, customHours = 16, onStatusChange, showTestSlider = false }: Props) {
  const goalHours = getPlanHours(plan.label, customHours);
  const planColors = getPlanColors(plan.id);
  const goalSeconds = goalHours * 3600;

  const [status, setStatus] = useState<FastingStatus>('READY');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackWidthRef = useRef(1);

  const sliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        const next = Math.round(ratio * goalSeconds);
        setElapsedSeconds(next);
        setStatus((s) => { if (s === 'READY') { setStartedAt(new Date(Date.now() - next * 1000)); onStatusChange?.('FASTING'); return 'FASTING'; } return s; });
      },
      onPanResponderMove: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        setElapsedSeconds(Math.round(ratio * goalSeconds));
      },
    })
  ).current;

  const changeStatus = (next: FastingStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  useEffect(() => {
    if (status === 'FASTING') {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => {
          const next = s + 1;
          if (next >= goalSeconds) {
            changeStatus('DONE');
            clearInterval(intervalRef.current!);
            return goalSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const progress = Math.min(elapsedSeconds / goalSeconds, 1);
  const percent = Math.round(progress * 100);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const remainingSeconds = goalSeconds - elapsedSeconds;
  const endpoint = status !== 'READY' && progress > 0.005 ? getEndpointXY(progress) : null;

  const projectedEnd = new Date(Date.now() + goalSeconds * 1000);
  const actualEnd = startedAt ? new Date(startedAt.getTime() + goalSeconds * 1000) : null;
  const endTime = actualEnd ?? projectedEnd;

  const handlePress = () => {
    if (status === 'READY') {
      setStartedAt(new Date());
      setElapsedSeconds(0);
      changeStatus('FASTING');
    } else if (status === 'FASTING') {
      changeStatus('DONE');
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      changeStatus('READY');
      setStartedAt(null);
      setElapsedSeconds(0);
    }
  };

  // Visual config
  const isFasting = status !== 'READY';
  const cardBg = isFasting ? planColors.badge : Colors.cardDefault;
  const ringTrack = isFasting ? '#D8D8D8' : Colors.cardRing;
  const tickColor = isFasting ? '#C8C8C8' : Colors.cardTick;
  const ringColor = planColors.accent;

  const centerLabel = status === 'READY'
    ? `${goalHours} SAATLİK HEDEF`
    : 'KALAN SÜRE';

  const centerTime = status === 'READY'
    ? formatHMS(goalSeconds)
    : formatHMS(remainingSeconds);

  const hintText = status === 'READY'
    ? `Şimdi başlarsan ${formatClock(projectedEnd)}'de biter`
    : status === 'FASTING'
    ? `%${percent} tamamlandı · bitiş ${formatClock(endTime)}`
    : 'Oruç tamamlandı! 🎉';

  const buttonBg = status === 'READY' ? '#1A1A1A' : Colors.fastingActive;
  const buttonTextColor = status === 'READY' ? '#FFFFFF' : Colors.fastingActiveText;
  const buttonLabel = status === 'READY' ? 'Orucu başlat' : status === 'FASTING' ? 'Orucu bitir' : 'Yeni oruç';

  return (
    <View className="w-full gap-3">
      {/* Main card */}
      <View className="rounded-[28px] px-5 pt-6 pb-5 items-center w-full" style={{ backgroundColor: cardBg }}>

        {/* Ring */}
        <View className="items-center justify-center mb-5" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            {/* Track */}
            <Circle cx={CX} cy={CY} r={RADIUS} stroke={ringTrack} strokeWidth={STROKE_WIDTH} fill="none" />

            {/* Progress arc */}
            {isFasting && (
              <Circle
                cx={CX} cy={CY} r={RADIUS}
                stroke={ringColor} strokeWidth={STROKE_WIDTH} fill="none"
                strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90, ${CX}, ${CY})`}
              />
            )}

            {/* White inner fill */}
            <Circle cx={CX} cy={CY} r={INNER_RADIUS - 6} fill="#FFFFFF" />

            {/* Clock ticks (on top of white fill) */}
            <ClockTicks color={tickColor} />

            {/* Start dot — 12 o'clock, centered on arc */}
            {isFasting && (
              <Circle cx={CX} cy={CY - RADIUS} r={DOT_R} fill={planColors.accent} />
            )}

            {/* End dot — progress tip, centered on arc */}
            {endpoint && (
              <Circle cx={endpoint.x} cy={endpoint.y} r={DOT_R} fill={planColors.accent} />
            )}
          </Svg>

          {/* Center text */}
          <View className="absolute items-center px-8" pointerEvents="none">
            <Text className="text-[11px] font-bold tracking-widest mb-1" style={{ color: planColors.accent }}>
              {centerLabel}
            </Text>
            <Text className="font-black text-[#1A1A1A]" style={{ fontSize: 42, letterSpacing: -1 }}>
              {centerTime}
            </Text>
            <Text className="text-[12px] text-[#999] mt-1 text-center">{hintText}</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          className="rounded-full py-[17px] w-full items-center"
          style={{ backgroundColor: buttonBg }}
          onPress={handlePress}
          activeOpacity={0.85}
        >
          <View className="flex-row items-center gap-2.5">
            {status === 'READY' && (
              <View style={{ width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderLeftWidth: 13, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: buttonTextColor }} />
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
      </View>

      {/* Test slider */}
      {showTestSlider && (
        <View className="bg-white rounded-2xl px-4 py-4 gap-2">
          <Text className="text-[10px] font-semibold tracking-widest text-[#BBBBBB]">
            TEST · {formatHMS(elapsedSeconds)} / {formatHMS(goalSeconds)}
          </Text>
          <View
            className="h-8 justify-center"
            onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
            {...sliderPan.panHandlers}
          >
            {/* Track */}
            <View className="w-full h-1.5 rounded-full" style={{ backgroundColor: Colors.cardRing }}>
              <View
                className="h-1.5 rounded-full"
                style={{ width: `${progress * 100}%`, backgroundColor: planColors.accent }}
              />
            </View>
            {/* Thumb */}
            <View
              className="absolute w-5 h-5 rounded-full border-2 border-white"
              style={{
                left: `${progress * 100}%`,
                marginLeft: -10,
                backgroundColor: planColors.accent,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
            />
          </View>
        </View>
      )}

      {/* Info cards */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl px-4 py-4">
          <Text className="text-[10px] font-semibold tracking-widest text-[#BBBBBB] mb-2">BAŞLANGIÇ</Text>
          {startedAt ? (
            <>
              <Text className="text-2xl font-bold text-[#1A1A1A]">{formatClock(startedAt)}</Text>
              <Text className="text-xs text-[#AAAAAA] mt-0.5">{getDayLabel(startedAt)}</Text>
            </>
          ) : (
            <Text className="text-2xl font-bold text-[#1A1A1A]">—</Text>
          )}
        </View>
        <View className="flex-1 bg-white rounded-2xl px-4 py-4">
          <Text className="text-[10px] font-semibold tracking-widest text-[#BBBBBB] mb-2">BİTİŞ</Text>
          <Text className="text-2xl font-bold text-[#1A1A1A]">{formatClock(endTime)}</Text>
          <Text className="text-xs text-[#AAAAAA] mt-0.5">{getDayLabel(endTime)}</Text>
        </View>
      </View>
    </View>
  );
}
