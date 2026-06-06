import { useRef, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

interface GestureHandlers {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onTap: () => void;
}

const SWIPE_THRESHOLD = 30;
const TAP_THRESHOLD = 10;

export const useGestures = (handlers: GestureHandlers) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);

  const onTouchStart = useCallback((e: GestureResponderEvent) => {
    startX.current = e.nativeEvent.pageX;
    startY.current = e.nativeEvent.pageY;
    startTime.current = Date.now();
  }, []);

  const onTouchEnd = useCallback((e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - startX.current;
    const dy = e.nativeEvent.pageY - startY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const elapsed = Date.now() - startTime.current;

    if (absDx < TAP_THRESHOLD && absDy < TAP_THRESHOLD && elapsed < 250) {
      handlers.onTap();
      return;
    }

    if (absDx > SWIPE_THRESHOLD || absDy > SWIPE_THRESHOLD) {
      if (absDx > absDy) {
        dx > 0 ? handlers.onSwipeRight() : handlers.onSwipeLeft();
      } else {
        dy > 0 ? handlers.onSwipeDown() : handlers.onSwipeUp();
      }
    }
  }, [handlers]);

  return { onTouchStart, onTouchEnd };
};
