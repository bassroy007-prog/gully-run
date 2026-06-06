import { useRef, useCallback } from 'react';

type TickFn = (delta: number) => void;

export const useGameLoop = () => {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const tickFnRef = useRef<TickFn>(() => {});

  const loop = useCallback((time: number) => {
    const delta = lastTimeRef.current ? Math.min(time - lastTimeRef.current, 50) : 16.67;
    lastTimeRef.current = time;
    tickFnRef.current(delta);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback((tickFn: TickFn) => {
    tickFnRef.current = tickFn;
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return { start, stop };
};
