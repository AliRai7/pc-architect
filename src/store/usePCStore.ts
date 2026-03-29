'use client';

import { create } from 'zustand';
import { PCStore } from '@/types';

const initialState = {
  explosionProgress: 0,
  hoveredComponent: null,
  selectedComponent: null,
  isPanelOpen: false,
  isLoading: true,
  isExploded: false,
};

export const usePCStore = create<PCStore>((set) => ({
  ...initialState,

  setExplosionProgress: (progress) => set({ 
    explosionProgress: progress,
    isExploded: progress > 0.5 
  }),

  setHoveredComponent: (id) => set({ hoveredComponent: id }),

  selectComponent: (id) => set({ 
    selectedComponent: id,
    isPanelOpen: id !== null 
  }),

  closePanel: () => set({ 
    selectedComponent: null,
    isPanelOpen: false 
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setExploded: (exploded) => set({ isExploded: exploded }),

  reset: () => set(initialState),
}));
