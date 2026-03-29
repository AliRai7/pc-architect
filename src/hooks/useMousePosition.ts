'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Vector2 } from 'three';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafRef = useRef<number>();
  const pendingUpdate = useRef<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (pendingUpdate.current) {
      const { x, y } = pendingUpdate.current;
      setMousePosition({
        x,
        y,
        normalizedX: (x / window.innerWidth) * 2 - 1,
        normalizedY: -(y / window.innerHeight) * 2 + 1,
      });
      pendingUpdate.current = null;
    }
    rafRef.current = undefined;
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pendingUpdate.current = { x: event.clientX, y: event.clientY };
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updatePosition]);

  return mousePosition;
}

export function useSmoothMousePosition(smoothing: number = 0.1) {
  const mousePosition = useMousePosition();
  const [smoothPosition, setSmoothPosition] = useState(new Vector2(0, 0));

  useEffect(() => {
    setSmoothPosition((prev) => {
      const target = new Vector2(mousePosition.normalizedX, mousePosition.normalizedY);
      return prev.lerp(target, smoothing);
    });
  }, [mousePosition, smoothing]);

  return smoothPosition;
}
