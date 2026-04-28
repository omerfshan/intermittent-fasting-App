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
import { EndFastModal } from './PlanScreenComponents/FastingTimerCard/EndFastModal';
import { FastingStatus } from '../Types/FastingStatus';

const EATING_COLOR = '#F5C430';      // golden amber for eating window ring
const EATING_BADGE = '#FDF7DC';      // light yellow card background

function getPlanHours(label: string, customHours = 16): number {
  const match = label.match(/^(\d+):/);
  if (match) return parseInt(match[1], 10);
  if (label === 'OMAD') return 23;
  return customHours;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function formatHMS(s: number) { return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; }
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

  const {
    status, startedAt, endedAt, scheduledStartAt, elapsedSeconds,
    waitRemainingSeconds, waitTotalSeconds,
    eatingRemainingSeconds, eatingTotalSeconds, eatingWindowSeconds,
    setElapsedSeconds, setStartedAt, changeStatus, handlePress,
    startFasting, endFast, cancelFast,
  } = useFastingTimer(goalSeconds, onStatusChange);

  const [startModalVisible, setStartModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);

  const onButtonPress = () => {
    if (status === 'READY' || isDone) {
      setStartModalVisible(true);
    } else if (status === 'FASTING') {
      setEndModalVisible(true);
    } else {
      handlePress();
    }
  };

  // ── State flags ────────────────────────────────────────────────────────────
  const isWaiting = status === 'WAITING';
  const isDone    = status === 'DONE';
  const showRing  = status !== 'READY';

  // ── Progress ───────────────────────────────────────────────────────────────
  const fastProgress = Math.min(elapsedSeconds / goalSeconds, 1);
  const waitProgress = waitTotalSeconds > 0
    ? Math.max(0, Math.min(1 - waitRemainingSeconds / waitTotalSeconds, 1))
    : 0;
  // Eating ring drains from full→empty as eating window passes
  const eatingProgress = eatingTotalSeconds > 0
    ? Math.max(0, eatingRemainingSeconds / eatingTotalSeconds)
    : 0;

  const progress =
    isWaiting ? waitProgress :
    isDone    ? eatingProgress :
    fastProgress;

  // ── Ring colours ───────────────────────────────────────────────────────────
  const WAITING_WARN_SECS = 600;
  const isWaitingWarning  = isWaiting && waitRemainingSeconds <= WAITING_WARN_SECS;
  const ringColor =
    isDone           ? EATING_COLOR :
    isWaitingWarning ? '#F0963A'    :
    planColors.accent;
  const accentColor = ringColor;

  // ── Card background ────────────────────────────────────────────────────────
  const cardBg =
    status === 'FASTING' ? planColors.badge :
    isDone               ? EATING_BADGE     :
    Colors.cardDefault;

  // Ring track / tick use muted grey whenever ring is active
  const ringActive = status === 'FASTING' || isDone;

  // ── Timing helpers ─────────────────────────────────────────────────────────
  const projectedEnd = new Date(Date.now() + goalSeconds * 1000);
  const displayStartAt = startedAt ?? scheduledStartAt;
  const actualEnd = endedAt
    ?? (startedAt ? new Date(startedAt.getTime() + goalSeconds * 1000) : null);
  const endTime = actualEnd ?? projectedEnd;

  const eatingEndTime = endedAt
    ? new Date(endedAt.getTime() + eatingWindowSeconds * 1000)
    : null;

  const eatingHours = Math.round(eatingWindowSeconds / 3600);

  // ── Center text ────────────────────────────────────────────────────────────
  const percent = Math.round(fastProgress * 100);
  const remainingSeconds = goalSeconds - elapsedSeconds;

  const centerLabel =
    status === 'READY'   ? `${goalHours} SAATLİK HEDEF` :
    status === 'WAITING' ? 'BAŞLAMAYA KALAN'             :
    isDone               ? 'YEME PENCERESİ'              :
    'KALAN SÜRE';

  const centerTime =
    status === 'READY'   ? formatHMS(goalSeconds)          :
    status === 'WAITING' ? formatHMS(waitRemainingSeconds)  :
    isDone               ? formatHMS(eatingRemainingSeconds) :
    formatHMS(remainingSeconds);

  const hintText =
    status === 'READY'
      ? `Şimdi başlarsan ${formatClock(projectedEnd)}'de biter`
    : status === 'WAITING'
      ? `${formatClock(scheduledStartAt!)}'de başlıyor`
    : status === 'FASTING'
      ? `%${percent} tamamlandı · bitiş ${formatClock(endTime)}`
    : eatingEndTime
      ? `Oruç tamamlandı 🎉 · ${formatClock(eatingEndTime)}'de biter`
      : 'Oruç tamamlandı! 🎉';

  return (
    <View className="w-full gap-3">
      <View className="rounded-[28px] px-5 pt-6 pb-5 items-center w-full" style={{ backgroundColor: cardBg }}>
        <View className="items-center justify-center mb-5" style={{ width: 280, height: 280 }}>
          <FastingRing
            progress={progress}
            showRing={showRing}
            ringTrack={ringActive ? '#D8D8D8' : Colors.cardRing}
            ringColor={ringColor}
            tickColor={ringActive ? '#C8C8C8' : Colors.cardTick}
            accentColor={accentColor}
          />
          <FastingCenterText
            label={centerLabel}
            time={centerTime}
            hint={hintText}
            accentColor={accentColor}
          />
        </View>

        {/* In DONE state show the button with READY appearance to start a new fast */}
        <FastingButton status={isDone ? 'READY' : status} onPress={onButtonPress} />
      </View>

      <StartTimeModal
        visible={startModalVisible}
        onClose={() => setStartModalVisible(false)}
        onConfirm={(startTime) => {
          setStartModalVisible(false);
          startFasting(startTime);
        }}
        accentColor={planColors.accent}
      />

      {startedAt && (
        <EndFastModal
          visible={endModalVisible}
          onClose={() => setEndModalVisible(false)}
          onDelete={() => {
            setEndModalVisible(false);
            cancelFast();
          }}
          onSave={(startTime, endTime) => {
            setEndModalVisible(false);
            endFast(endTime, startTime);
          }}
          startedAt={startedAt}
          planLabel={plan.label}
          planColors={planColors}
          goalHours={goalHours}
        />
      )}

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
          time={displayStartAt ? formatClock(displayStartAt) : '—'}
          dayLabel={displayStartAt ? getDayLabel(displayStartAt) : ''}
        />
        <InfoCard
          title={isDone ? `YEME (${eatingHours} SA)` : 'BİTİŞ'}
          time={isDone && eatingEndTime ? formatClock(eatingEndTime) : formatClock(endTime)}
          dayLabel={isDone && eatingEndTime ? getDayLabel(eatingEndTime) : getDayLabel(endTime)}
        />
      </View>
    </View>
  );
}
