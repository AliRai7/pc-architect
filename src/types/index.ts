import { Vector3 } from 'three';

export interface PCComponent {
  id: string;
  name: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  explosionDirection: Vector3;
  explosionRotation?: Vector3;
  position: Vector3;
  color: string;
}

export interface ComponentState {
  explosionProgress: number;
  hoveredComponent: string | null;
  selectedComponent: string | null;
  isPanelOpen: boolean;
  isLoading: boolean;
  isExploded: boolean;
}

export interface ComponentActions {
  setExplosionProgress: (progress: number) => void;
  setHoveredComponent: (id: string | null) => void;
  selectComponent: (id: string | null) => void;
  closePanel: () => void;
  setLoading: (loading: boolean) => void;
  setExploded: (exploded: boolean) => void;
  reset: () => void;
}

export type PCStore = ComponentState & ComponentActions;
