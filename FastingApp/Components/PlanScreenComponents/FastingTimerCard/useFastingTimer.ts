import { useState, useEffect, useRef } from 'react';
import { FastingStatus } from '../../../Types/FastingStatus';

export function useFastingTimer(goalSeconds: number, onStatusChange?: (s: FastingStatus) => void) {
  // Eating window = remaining hours in the day after fasting (min 1h)
  const eatingWindowSeconds = Math.max(3600, 24 * 3600 - goalSeconds);

  const [status, setStatus] = useState<FastingStatus>('READY');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [scheduledStartAt, setScheduledStartAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waitRemainingSeconds, setWaitRemainingSeconds] = useState(0);
  const [waitTotalSeconds, setWaitTotalSeconds] = useState(0);
  const [eatingRemainingSeconds, setEatingRemainingSeconds] = useState(0);
  const [eatingTotalSeconds, setEatingTotalSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scheduledStartRef = useRef<Date | null>(null);
  // Ref for eating window start — avoids stale closure in the interval callback
  const endedAtRef = useRef<Date | null>(null);

  const changeStatus = (next: FastingStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  const resetToReady = () => {
    setStartedAt(null);
    setEndedAt(null);
    setElapsedSeconds(0);
    setEatingRemainingSeconds(0);
    setEatingTotalSeconds(0);
    endedAtRef.current = null;
    changeStatus('READY');
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (status === 'FASTING') {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => {
          const next = s + 1;
          if (next >= goalSeconds) {
            // Record actual end time for the eating window
            const now = new Date();
            endedAtRef.current = now;
            setEndedAt(now);
            changeStatus('DONE');
            clearInterval(intervalRef.current!);
            return goalSeconds;
          }
          return next;
        });
      }, 1000);

    } else if (status === 'WAITING') {
      intervalRef.current = setInterval(() => {
        const scheduled = scheduledStartRef.current;
        if (!scheduled) return;
        const remaining = Math.ceil((scheduled.getTime() - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(intervalRef.current!);
          setStartedAt(scheduled);
          setElapsedSeconds(0);
          setWaitRemainingSeconds(0);
          changeStatus('FASTING');
        } else {
          setWaitRemainingSeconds(remaining);
        }
      }, 1000);

    } else if (status === 'DONE') {
      // Start eating-window countdown from when fasting ended
      const eatStart = endedAtRef.current ?? new Date();
      const eatEnd = new Date(eatStart.getTime() + eatingWindowSeconds * 1000);
      const initialRemaining = Math.max(0, Math.ceil((eatEnd.getTime() - Date.now()) / 1000));

      if (initialRemaining === 0) {
        resetToReady();
        return;
      }

      setEatingTotalSeconds(eatingWindowSeconds);
      setEatingRemainingSeconds(initialRemaining);

      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((eatEnd.getTime() - Date.now()) / 1000));
        setEatingRemainingSeconds(remaining);
        if (remaining === 0) {
          clearInterval(intervalRef.current!);
          resetToReady();
        }
      }, 1000);
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const startFasting = (startTime: Date) => {
    // Clear previous fast data (handles starting fresh from DONE/eating state)
    if (intervalRef.current) clearInterval(intervalRef.current);
    endedAtRef.current = null;
    setEndedAt(null);
    setEatingRemainingSeconds(0);
    setEatingTotalSeconds(0);

    const now = Date.now();
    const startMs = startTime.getTime();

    if (startMs > now) {
      const waitSecs = Math.ceil((startMs - now) / 1000);
      scheduledStartRef.current = startTime;
      setScheduledStartAt(startTime);
      setWaitTotalSeconds(waitSecs);
      setWaitRemainingSeconds(waitSecs);
      changeStatus('WAITING');
    } else {
      const elapsed = Math.floor((now - startMs) / 1000);
      const clamped = Math.max(0, elapsed);
      setStartedAt(startTime);
      if (clamped >= goalSeconds) {
        const doneAt = new Date(startMs + goalSeconds * 1000);
        endedAtRef.current = doneAt;
        setEndedAt(doneAt);
        setElapsedSeconds(goalSeconds);
        changeStatus('DONE');
      } else {
        setElapsedSeconds(clamped);
        changeStatus('FASTING');
      }
    }
  };

  // Called from EndFastModal when user confirms ending the fast
  const endFast = (endTime: Date, startOverride?: Date) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const effectiveStart = startOverride ?? startedAt;
    if (startOverride) setStartedAt(startOverride);
    endedAtRef.current = endTime;
    setEndedAt(endTime);
    if (effectiveStart) {
      const elapsed = Math.floor((endTime.getTime() - effectiveStart.getTime()) / 1000);
      setElapsedSeconds(Math.max(0, Math.min(elapsed, goalSeconds)));
    }
    changeStatus('DONE');
  };

  // Called from EndFastModal "Sil" — discards the fast entirely
  const cancelFast = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endedAtRef.current = null;
    setStartedAt(null);
    setEndedAt(null);
    setElapsedSeconds(0);
    changeStatus('READY');
  };

  const handlePress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (status === 'WAITING') {
      scheduledStartRef.current = null;
      setScheduledStartAt(null);
      setWaitRemainingSeconds(0);
      setWaitTotalSeconds(0);
      changeStatus('READY');
    } else {
      resetToReady();
    }
  };

  return {
    status,
    startedAt,
    endedAt,
    scheduledStartAt,
    elapsedSeconds,
    waitRemainingSeconds,
    waitTotalSeconds,
    eatingRemainingSeconds,
    eatingTotalSeconds,
    eatingWindowSeconds,
    setElapsedSeconds,
    setStartedAt,
    changeStatus,
    handlePress,
    startFasting,
    endFast,
    cancelFast,
  };
}
