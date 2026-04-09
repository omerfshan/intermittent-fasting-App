import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 16 * 60 * 60 * 1000;

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current!);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggle = () => setIsRunning((prev) => !prev);

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
  };

  const remaining = Math.max(DEFAULT_DURATION - elapsed, 0);
  const progress = elapsed / DEFAULT_DURATION;

  return { isRunning, elapsed, remaining, progress, toggle, reset };
}
