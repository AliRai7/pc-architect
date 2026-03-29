'use client';

import dynamic from 'next/dynamic';
import { Navigation } from '@/components/ui/Navigation';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { usePCStore } from '@/store/usePCStore';

// Dynamically import the 3D scene to avoid SSR issues
const Scene = dynamic(
  () => import('@/components/3d/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const { isLoading } = usePCStore();

  return (
    <main className="relative min-h-screen">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* 3D Scene */}
      <Scene />

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Glass Side Panel */}
      <GlassPanel />

      {/* Content Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 opacity-0">
              PC Architect
            </h1>
            <p className="text-xl text-white/60 opacity-0">
              Scroll to explore
            </p>
          </div>
        </section>

        {/* Spacer for scroll */}
        <section className="h-[200vh]" />
      </div>
    </main>
  );
}
