'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePCStore } from '@/store/usePCStore';

export function ScrollIndicator() {
  const { isExploded, isLoading } = usePCStore();

  if (isLoading || isExploded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.5 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
    >
      <span className="text-white/50 text-sm mb-2 font-medium tracking-wide">
        Scroll to Explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm"
      >
        <ChevronDown className="w-5 h-5 text-accent-primary" />
      </motion.div>
    </motion.div>
  );
}
