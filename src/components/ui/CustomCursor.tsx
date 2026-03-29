'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { usePCStore } from '@/store/usePCStore';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { hoveredComponent, isPanelOpen } = usePCStore();
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const glowXSpring = useSpring(cursorX, { damping: 30, stiffness: 200 });
  const glowYSpring = useSpring(cursorY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    // Only show custom cursor on desktop
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY]);

  if (!isVisible || isPanelOpen) return null;

  const isHovering = hoveredComponent !== null;

  return (
    <>
      {/* Glow effect */}
      <motion.div
        ref={glowRef}
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: glowXSpring,
          y: glowYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: isHovering ? 60 : 40,
            height: isHovering ? 60 : 40,
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2 border-accent-primary"
          style={{
            width: isHovering ? 24 : 16,
            height: isHovering ? 24 : 16,
          }}
          animate={{
            scale: isHovering ? 1.2 : 1,
            borderColor: isHovering ? '#A78BFA' : '#7C3AED',
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-accent-primary"
          animate={{
            scale: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Trailing particles */}
      {isHovering && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-[9998]"
              style={{
                x: useSpring(cursorX, { damping: 40 + i * 10, stiffness: 300 }),
                y: useSpring(cursorY, { damping: 40 + i * 10, stiffness: 300 }),
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              <div
                className="w-1 h-1 rounded-full bg-accent-primary/50"
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              />
            </motion.div>
          ))}
        </>
      )}
    </>
  );
}
