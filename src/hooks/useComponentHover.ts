'use client';

import { useRef, useCallback } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';
import { usePCStore } from '@/store/usePCStore';

export function useComponentHover(componentId: string) {
  const meshRef = useRef<Mesh>(null);
  const { setHoveredComponent, hoveredComponent } = usePCStore();
  const isHovered = hoveredComponent === componentId;

  const onPointerOver = useCallback((event: any) => {
    event.stopPropagation();
    setHoveredComponent(componentId);
    
    if (meshRef.current) {
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissive.setHex(0x7C3AED);
      material.emissiveIntensity = 0.3;
    }
  }, [componentId, setHoveredComponent]);

  const onPointerOut = useCallback((event: any) => {
    event.stopPropagation();
    setHoveredComponent(null);
    
    if (meshRef.current) {
      const material = meshRef.current.material as MeshStandardMaterial;
      material.emissive.setHex(0x000000);
      material.emissiveIntensity = 0;
    }
  }, [setHoveredComponent]);

  return {
    meshRef,
    isHovered,
    onPointerOver,
    onPointerOut,
  };
}
