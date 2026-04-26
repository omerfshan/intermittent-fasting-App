import React, { useState } from 'react';
import { View } from 'react-native';
import { IPlan } from '../Interface/IPlans';
import { Colors, getPlanColors } from '../Theme/colors';
import { useFastingTimer } from './PlanScreenComponents/FastingTimerCard/useFastingTimer';
import { FastingRing } from './PlanScreenComponents/FastingTimerCard/FastingRing';
import { FastingCenterText } from './PlanScreenComponents/FastingTimerCard/FastingCenterText';
import { FastingButton } from './PlanScreenComponents/FastingTimerCard/FastingButton';
import { InfoCard } from './PlanScreenComponents/FastingTimerCard/InfoCard';
import { TestSlider } from './PlanScreenComponents/FastingTimerCard/TestSlider';
import { StartTimeModal } from './PlanScreenComponents/FastingTimerCard/StartTimeModal';
import { FastingStatus } from '../Types/FastingStatus';




function getPlanHours(label: string, customHours = 16): number {
  const match = label.match(/^(\d+):/);
  if (match) return parseInt(match[1], 10);
  if (label === 'OMAD') return 23;
  return customHours;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function formatHMS(s: number) { return `${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`; }
function formatClock(d: Date) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function getDayLabel(date: Date) {
  const today = new Date(), yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Bugün';
  if (date.toDateString() === yesterday.toDateString()) return 'Dün';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

interface Props {
  plan: IPlan;
  customHours?: number;
  onStatusChange?: (status: FastingStatus) => void;
  showTestSlider?: boolean;
}

export default function FastingTimerCard({ plan, customHours = 16, onStatusChange, showTestSlider = false }: Props) {
  const goalHours = getPlanHours(plan.label, customHours);
  const goalSeconds = goalHours * 3600;
  const planColors = getPlanColors(plan.id);

  const { status, startedAt, elapsedSeconds, setElapsedSeconds, setStartedAt, changeStatus, handlePress, startFasting } =
    useFastingTimer(goalSeconds, onStatusChange);

  const [modalVisible, setModalVisible] = useState(false);

  const onButtonPress = () => {
    if (status === 'READY') {
      setModalVisible(true);
    } else {
      handlePress();
    }
  };

  const progress = Math.min(elapsedSeconds / goalSeconds, 1);
  const percent = Math.round(progress * 100);
  const remainingSeconds = goalSeconds - elapsedSeconds;
  const isFasting = status !== 'READY';

  const projectedEnd = new Date(Date.now() + goalSeconds * 1000);
  const actualEnd = startedAt ? new Date(startedAt.getTime() + goalSeconds * 1000) : null;
  const endTime = actualEnd ?? projectedEnd;

  const cardBg = isFasting ? planColors.badge : Colors.cardDefault;

  const centerLabel = status === 'READY' ? `${goalHours} SAATLİK HEDEF` : 'KALAN SÜRE';
  const centerTime = status === 'READY' ? formatHMS(goalSeconds) : formatHMS(remainingSeconds);
  const hintText = status === 'READY'
    ? `Şimdi başlarsan ${formatClock(projectedEnd)}'de biter`
    : status === 'FASTING'
    ? `%${percent} tamamlandı · bitiş ${formatClock(endTime)}`
    : 'Oruç tamamlandı! 🎉';

  return (
    <View className="w-full gap-3">
      <View className="rounded-[28px] px-5 pt-6 pb-5 items-center w-full" style={{ backgroundColor: cardBg }}>
        <View className="items-center justify-center mb-5" style={{ width: 280, height: 280 }}>
          <FastingRing
            progress={progress}
            isFasting={isFasting}
            ringTrack={isFasting ? '#D8D8D8' : Colors.cardRing}
            ringColor={planColors.accent}
            tickColor={isFasting ? '#C8C8C8' : Colors.cardTick}
            accentColor={planColors.accent}
          />
          <FastingCenterText
            label={centerLabel}
            time={centerTime}
            hint={hintText}
            accentColor={planColors.accent}
          />
        </View>
        <FastingButton status={status} onPress={onButtonPress} />
      </View>

      <StartTimeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(startTime) => {
          setModalVisible(false);
          startFasting(startTime);
        }}
        accentColor={planColors.accent}
      />

      {showTestSlider && (
        <TestSlider
          elapsedSeconds={elapsedSeconds}
          goalSeconds={goalSeconds}
          progress={progress}
          accentColor={planColors.accent}
          onSlide={(val) => {
            setElapsedSeconds(val);
            if (status === 'READY') {
              setStartedAt(new Date(Date.now() - val * 1000));
              changeStatus('FASTING');
            }
          }}
        />
      )}

      <View className="flex-row gap-3">
        <InfoCard
          title="BAŞLANGIÇ"
          time={startedAt ? formatClock(startedAt) : '—'}
          dayLabel={startedAt ? getDayLabel(startedAt) : ''}
        />
        <InfoCard
          title="BİTİŞ"
          time={formatClock(endTime)}
          dayLabel={getDayLabel(endTime)}
        />
      </View>
    </View>
  );
}