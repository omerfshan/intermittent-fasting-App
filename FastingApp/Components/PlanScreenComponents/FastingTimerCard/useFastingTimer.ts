import { useState, useEffect, useRef } from 'react';
import { FastingStatus } from '../../FastingTimerCard';


export function useFastingTimer(goalSeconds: number, onStatusChange?: (s: FastingStatus) => void) {
  const [status, setStatus] = useState<FastingStatus>('READY');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return { status, startedAt, elapsedSeconds, setElapsedSeconds, setStartedAt, changeStatus, handlePress };
}