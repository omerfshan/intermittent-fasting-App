import { useState, useEffect, useRef } from 'react';
import { FastingStatus } from '../../../Types/FastingStatus';

export function useFastingTimer(goalSeconds: number, onStatusChange?: (s: FastingStatus) => void) {
  const [status, setStatus] = useState<FastingStatus>('READY');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [scheduledStartAt, setScheduledStartAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waitRemainingSeconds, setWaitRemainingSeconds] = useState(0);
  const [waitTotalSeconds, setWaitTotalSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref avoids stale closure inside the interval callback
  const scheduledStartRef = useRef<Date | null>(null);

  const changeStatus = (next: FastingStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

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
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const startFasting = (startTime: Date) => {
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
        setElapsedSeconds(goalSeconds);
        changeStatus('DONE');
      } else {
        setElapsedSeconds(clamped);
        changeStatus('FASTING');
      }
    }
  };

  // Called from EndFastModal when user confirms ending the fast
  // startOverride: user may have adjusted start time in the modal
  const endFast = (endTime: Date, startOverride?: Date) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const effectiveStart = startOverride ?? startedAt;
    if (startOverride) setStartedAt(startOverride);
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
      // DONE → READY
      setStartedAt(null);
      setEndedAt(null);
      setElapsedSeconds(0);
      changeStatus('READY');
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
    setElapsedSeconds,
    setStartedAt,
    changeStatus,
    handlePress,
    startFasting,
    endFast,
    cancelFast,
  };
}
