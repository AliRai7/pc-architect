'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePCStore } from '@/store/usePCStore';
import { Cpu } from 'lucide-react';

export function LoadingScreen() {
  const { setLoading } = usePCStore();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'particles' | 'forming' | 'solidifying'>('particles');

  useEffect(() => {
    // Simulate loading phases
    const particleTimer = setTimeout(() => {
      setPhase('forming');
    }, 800);

    const formingTimer = setTimeout(() => {
      setPhase('solidifying');
    }, 1600);

    const completeTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(particleTimer);
      clearTimeout(formingTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [setLoading]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A0F 100%)',
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent-primary"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Glow effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-2xl bg-accent-primary/20 flex items-center justify-center glow-violet"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(124, 58, 237, 0.4)',
                    '0 0 40px rgba(124, 58, 237, 0.6)',
                    '0 0 20px rgba(124, 58, 237, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Cpu className="w-12 h-12 text-accent-primary" />
              </motion.div>

              {/* Orbiting dots */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-accent-primary"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 1,
                  }}
                  style={{
                    originX: 0,
                    originY: 0,
                    translateX: -4,
                    translateY: -4,
                  }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full bg-accent-primary"
                    style={{
                      transform: `translateX(${60 + i * 10}px)`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            <span className="gradient-text">PC</span> Architect
          </motion.h1>

          {/* Phase text */}
          <motion.p
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/60 text-sm mb-8 capitalize"
          >
            {phase === 'particles' && 'Assembling particles...'}
            {phase === 'forming' && 'Forming components...'}
            {phase === 'solidifying' && 'Solidifying structure...'}
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-bright rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Progress Text */}
          <motion.p
            className="mt-3 text-white/40 text-xs font-mono"
          >
            {progress}%
          </motion.p>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <span className="text-white/30 text-xs">Initializing 3D Engine</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
