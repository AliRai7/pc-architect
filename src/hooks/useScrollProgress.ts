'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollProgress {
  progress: number;
  scrollY: number;
  maxScroll: number;
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    maxScroll: 0,
  });

  const rafRef = useRef<number>();
  const pendingScroll = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (pendingScroll.current !== null) {
      const scrollY = pendingScroll.current;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      setScrollProgress({
        progress: Math.min(Math.max(progress, 0), 1),
        scrollY,
        maxScroll,
      });
      pendingScroll.current = null;
    }
    rafRef.current = undefined;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      pendingScroll.current = window.scrollY;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    // Set initial values
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateProgress]);

  return scrollProgress;
}

export function useElementScrollProgress(elementRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate progress based on element position in viewport
      const start = windowHeight;
      const end = -elementHeight;
      const current = elementTop;

      const rawProgress = (start - current) / (start - end);
      setProgress(Math.min(Math.max(rawProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return progress;
}
