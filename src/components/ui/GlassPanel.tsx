'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Zap, HardDrive, Fan, CircuitBoard, Database, Battery } from 'lucide-react';
import { usePCStore } from '@/store/usePCStore';
import { getComponentById } from '@/lib/data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  gpu: Zap,
  cpu: Cpu,
  ram1: Database,
  ram2: Database,
  ram3: Database,
  ram4: Database,
  cooling: Fan,
  motherboard: CircuitBoard,
  ssd: HardDrive,
  psu: Battery,
};

export function GlassPanel() {
  const { isPanelOpen, selectedComponent, closePanel } = usePCStore();
  const component = selectedComponent ? getComponentById(selectedComponent) : null;

  if (!component) return null;

  const Icon = iconMap[component.id] || Cpu;

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 p-4 sm:p-6"
          >
            <div className="glass-panel h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center glow-violet">
                    <Icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{component.name}</h2>
                    <p className="text-sm text-white/60">{component.id.toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <p className="text-white/80 leading-relaxed mb-8">
                  {component.description}
                </p>

                {/* Specs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
                    Specifications
                  </h3>
                  <div className="grid gap-3">
                    {component.specs.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-primary/30 transition-colors"
                      >
                        <span className="text-white/60 text-sm">{spec.label}</span>
                        <span className="text-white font-mono font-semibold">{spec.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                    <span className="text-sm font-semibold text-accent-bright">Interactive Mode</span>
                  </div>
                  <p className="text-sm text-white/60">
                    Click on other components to explore their specifications. Scroll to see the exploded view.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={closePanel}
                  className="w-full py-3 px-4 rounded-xl bg-accent-primary hover:bg-accent-bright text-white font-semibold transition-all duration-300 glow-violet hover:shadow-lg"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
